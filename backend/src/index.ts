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

// Optional monitoring dependencies (loaded dynamically if env vars set)
let Sentry: any = null;
let PostHogClient: any = null;

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Initialize Sentry if DSN is set (dynamic import to avoid hard dependency)
if (process.env.SENTRY_DSN) {
  // @ts-ignore
  Sentry = require('@sentry/node');
  // @ts-ignore
  const Tracing = require('@sentry/tracing');
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

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
  res.locals.cv = cv; // Set CV for analytics tracking
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
  const mode = (req.query.mode as string) || 'ats';
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
    const pdfBuffer = await generatePdf(cv, mode as 'ats' | 'visual' | 'both');
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

// Simple in-memory cache for AI tips (key: industry|section)
const tipsCache = new Map<string, { suggestions: string[]; ts: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

app.post('/api/ai/tips', requireAuth, async (req: Request, res: Response) => {
  const { industry, section, context } = req.body;
  if (!industry || !section) {
    return res.status(400).json({ error: 'Industry and section are required' });
  }
  const key = `${industry.toLowerCase()}|${section.toLowerCase()}`;
  const now = Date.now();
  const cached = tipsCache.get(key);
  if (cached && now - cached.ts < CACHE_TTL_MS) {
    res.locals.suggestions = cached.suggestions; // Set for analytics tracking
    return res.json({ suggestions: cached.suggestions });
  }

  // For MVP, static tips based on section
  const baseAction = AI_TIPS.action_verbs[section.toLowerCase()] || [];
  const baseKeywords = AI_TIPS.keywords[section.toLowerCase()] || [];
  const baseMetrics = AI_TIPS.metrics[section.toLowerCase()] || [];

  const all: string[] = [...baseAction, ...baseKeywords, ...baseMetrics];
  const unique = Array.from(new Set(all)).slice(0, 10);

  tipsCache.set(key, { suggestions: unique, ts: now });
  res.locals.suggestions = unique; // Set for analytics tracking
  res.json({ suggestions: unique });
});

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error occurred:', err);
  
  // Capture error with Sentry if initialized
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err, {
      request: req,
    });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// Sentry error handler (must be before app.listen)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Initialize PostHog if API key is set (optional dependency)
let posthog: any = null;
if (process.env.POSTHOG_API_KEY) {
  // Dynamic require to avoid hard dependency in builds
  // @ts-ignore
  const Client = require('posthog-node').Client;
  posthog = new Client({
    apiKey: process.env.POSTHOG_API_KEY,
    host: process.env.POSTHOG_HOST || 'https://app.posthog.com',
  });
}

// Analytics middleware
const analyticsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Capture request start for timing
  const start = Date.now();
  
  // Continue with request
  next();
  
  // After response, capture analytics
  const duration = Date.now() - start;
  
  // Track key events
  if (posthog) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq?.userId;
      
      // Track signup and login
      if (req.path === '/api/auth/register' && req.method === 'POST' && res.statusCode === 201) {
        posthog.capture('user_signed_up', { distinctId: userId, email: req.body.email });
      }
      
      if (req.path === '/api/auth/login' && req.method === 'POST' && res.statusCode === 200) {
        posthog.capture('user_logged_in', { distinctId: userId, email: req.body.email });
      }
      
      // Track CV creation
      if (req.path === '/api/cvs' && req.method === 'POST' && res.statusCode === 201) {
        posthog.capture('cv_created', { distinctId: userId, cv_id: res.locals?.cv?.id });
      }
      
      // Track PDF export
      if (req.path.startsWith('/api/cvs/') && req.path.endsWith('/export-pdf') && req.method === 'GET' && res.statusCode === 200) {
        posthog.capture('pdf_exported', { 
          distinctId: userId, 
          cv_id: req.params.id,
          mode: req.query.mode as string || 'ats',
          duration
        });
      }
      
      // Track AI tips usage
      if (req.path === '/api/ai/tips' && req.method === 'POST' && res.statusCode === 200) {
        posthog.capture('ai_tips_used', { 
          distinctId: userId, 
          industry: req.body.industry,
          section: req.body.section,
          suggestions_count: res.locals?.suggestions?.length || 0
        });
      }
      
      // Track general API usage
      if (req.path.startsWith('/api/') && !req.path.includes('auth')) {
        posthog.capture('api_called', { 
          distinctId: userId, 
          path: req.path,
          method: req.method,
          status_code: res.statusCode,
          duration
        });
      }
      
    } catch (error) {
      console.error('Error capturing analytics:', error);
    }
  }
};

// Apply analytics middleware
app.use(analyticsMiddleware);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development',
    sentry: process.env.SENTRY_DSN ? 'enabled' : 'disabled',
    posthog: process.env.POSTHOG_API_KEY ? 'enabled' : 'disabled',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log('Sentry monitoring:', process.env.SENTRY_DSN ? 'ENABLED' : 'DISABLED');
  console.log('PostHog analytics:', process.env.POSTHOG_API_KEY ? 'ENABLED' : 'DISABLED');
});
