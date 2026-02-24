import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, Prisma } from '@prisma/client';
import dotenv from 'dotenv';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { generatePdf } from './pdf/generator';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(helmet());
app.use(express.json());

// Rate limiter for auth
const authRateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});
const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authRateLimiter.consume(req.ip!);
    next();
  } catch (err) {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  }
};

// Auth helper
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

// Types
type AuthRequest = Request & { userId: string };

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    (req as AuthRequest).userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.post('/api/auth/register', rateLimitMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Email already in use' });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash: hash, name },
  });
  const token = generateToken(user.id);
  res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
});

app.post('/api/auth/login', rateLimitMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = generateToken(user.id);
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
});

app.post('/api/auth/logout', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Logged out' });
});

app.get('/api/cvs', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const cvs = await prisma.cv.findMany({
    where: { userId: authReq.userId },
    orderBy: { updatedAt: Prisma.SortOrder.desc },
  });
  res.json(cvs);
});

app.post('/api/cvs', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const { title, templateId, content } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title required' });
  }
  const cv = await prisma.cv.create({
    data: {
      userId: authReq.userId,
      title,
      templateId: templateId || 'default',
      content: content || {},
    },
  });
  res.status(201).json(cv);
});

app.get('/api/cvs/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const cv = await prisma.cv.findUnique({ where: { id: req.params.id! } });
  if (!cv || cv.userId !== authReq.userId) {
    return res.status(404).json({ error: 'CV not found' });
  }
  res.json(cv);
});

app.put('/api/cvs/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const { title, templateId, content } = req.body;
  const cv = await prisma.cv.findUnique({ where: { id: req.params.id! } });
  if (!cv || cv.userId !== authReq.userId) {
    return res.status(404).json({ error: 'CV not found' });
  }
  const updated = await prisma.cv.update({
    where: { id: req.params.id! },
    data: {
      ...(title && { title }),
      ...(templateId && { templateId }),
      ...(content && { content }),
      version: { increment: 1 },
    },
  });
  res.json(updated);
});

app.delete('/api/cvs/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const cv = await prisma.cv.findUnique({ where: { id: req.params.id! } });
  if (!cv || cv.userId !== authReq.userId) {
    return res.status(404).json({ error: 'CV not found' });
  }
  await prisma.cv.delete({ where: { id: req.params.id! } });
  res.status(204).send();
});

app.post('/api/cvs/:id/autosave', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const { content, version, title } = req.body;
  const cv = await prisma.cv.findUnique({ where: { id: req.params.id! } });
  if (!cv || cv.userId !== authReq.userId) {
    return res.status(404).json({ error: 'CV not found' });
  }
  if (version !== undefined && version !== cv.version) {
    return res.status(409).json({ error: 'Version conflict', currentVersion: cv.version });
  }
  const updateData: any = {
    content: content ?? cv.content,
    version: { increment: 1 },
  };
  if (title !== undefined) {
    updateData.title = title;
  }
  const updated = await prisma.cv.update({
    where: { id: req.params.id! },
    data: updateData,
  });
  res.json(updated);
});

app.get('/api/cvs/:id/export-pdf', requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { id } = req.params;
  const mode = (req.query.mode as 'ats' | 'visual' | 'both') || 'ats';
  const cv = await prisma.cv.findUnique({ where: { id: id! } });
  if (!cv || cv.userId !== authReq.userId) {
    return res.status(404).json({ error: 'CV not found' });
  }
  const user = await prisma.user.findUnique({ where: { id: authReq.userId } });
  if (!user) return res.status(401).json({ error: 'User not found' });
  if (mode !== 'ats' && user.role !== 'pro') {
    return res.status(403).json({ error: 'Upgrade to Pro to export this format' });
  }
  try {
    const pdfBuffer = await generatePdf(cv, mode);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cv-${cv.id}-${mode}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

// AI Tips endpoint
const AI_TIPS: Record<string, Record<string, string[]>> = {
  action_verbs: {
    experience: [
      'Spearheaded', 'Orchestrated', 'Championed', 'Pioneered', 'Revolutionized',
      'Transformed', 'Streamlined', 'Modernized', 'Automated', 'Integrated'
    ],
    summary: [
      'Results-driven', 'Detail-oriented', 'Innovative', 'Collaborative', 'Strategic',
      'Proactive', 'Analytical', 'Creative', 'Dynamic', 'Motivated'
    ],
    skills: [
      'Mastered', 'Proficient in', 'Skilled at', 'Experienced with', 'Competent in',
      'Fluent in', 'Certified in', 'Trained in', 'Specialized in', 'Adept at'
    ],
    projects: [
      'Developed', 'Built', 'Created', 'Designed', 'Engineered', 'Launched',
      'Implemented', 'Optimized', 'Enhanced', 'Modernized'
    ]
  },
  keywords: {
    experience: [
      'Project management', 'Cross-functional collaboration', 'Stakeholder engagement',
      'Process improvement', 'Budget management', 'Team leadership', 'Client relations',
      'Quality assurance', 'Risk management', 'Strategic planning'
    ],
    summary: [
      'Results-oriented', 'Detail-focused', 'Innovative thinker', 'Collaborative team player',
      'Strategic planner', 'Proactive problem solver', 'Analytical mindset', 'Creative approach',
      'Dynamic professional', 'Motivated achiever'
    ],
    skills: [
      'Technical proficiency', 'Software expertise', 'Programming languages', 'Design tools',
      'Analytical tools', 'Communication platforms', 'Project management software',
      'Data visualization', 'Cloud computing', 'Cybersecurity'
    ],
    projects: [
      'Full-stack development', 'Mobile application design', 'Web development', 'API integration',
      'Database management', 'UI/UX design', 'Cloud deployment', 'Agile methodology',
      'DevOps practices', 'Quality assurance'
    ]
  },
  metrics: {
    experience: [
      'Increased revenue by 25%', 'Reduced costs by 15%', 'Improved efficiency by 30%',
      'Saved 100+ hours annually', 'Managed $500K budget', 'Led team of 15+ members',
      'Achieved 95% customer satisfaction', 'Increased sales by 40%', 'Reduced processing time by 50%',
      'Implemented system serving 10K+ users'
    ],
    projects: [
      'Delivered project 2 weeks ahead of schedule', 'Achieved 99.9% uptime',
      'Reduced page load time by 60%', 'Increased user engagement by 35%',
      'Processed 1M+ transactions', 'Supported 50K+ concurrent users',
      'Reduced error rate by 80%', 'Improved conversion rate by 25%',
      'Generated $1M+ in revenue', 'Saved $200K in operational costs'
    ]
  }
};

app.post('/api/ai/tips', requireAuth, async (req: Request, res: Response) => {
  const { industry, section, context } = req.body;
  if (!industry || !section) {
    return res.status(400).json({ error: 'Industry and section are required' });
  }
  // Normalize
  const industryKey = industry.toLowerCase();
  const sectionKey = section.toLowerCase();

  // For MVP, static tips based on section and some industry hints
  const baseAction = AI_TIPS.action_verbs[sectionKey] || [];
  const baseKeywords = AI_TIPS.keywords[sectionKey] || [];
  const baseMetrics = AI_TIPS.metrics[sectionKey] || [];

  // Merge and dedupe suggestions, include base action verbs and keywords, and some metrics if relevant
  const all: string[] = [...baseAction, ...baseKeywords, ...baseMetrics];
  // Return top 10 unique
  const unique = Array.from(new Set(all)).slice(0, 10);

  res.json({ suggestions: unique });
});

// Start
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
