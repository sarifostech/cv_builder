import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

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
    await authRateLimiter.consume(req.ip);
    next();
  } catch (err) {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  }
};

// Auth helper
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

const requireAuth = (req: Request & { userId?: string }, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.userId = payload.userId;
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
  res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token });
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
  res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
});

app.post('/api/auth/logout', (req: Request, res: Response, next: NextFunction) => {
  // Stateless: client discards token
  res.status(200).json({ message: 'Logged out' });
});

app.get('/api/cvs', requireAuth, async (req: Request & { userId: string }, res: Response, next: NextFunction) => {
  const cvs = await prisma.cv.findMany({
    where: { userId: req.userId },
    orderBy: { updatedAt: 'desc' },
  });
  res.json(cvs);
});

app.post('/api/cvs', requireAuth, async (req: Request & { userId: string }, res: Response, next: NextFunction) => {
  const { title, templateId, content } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title required' });
  }
  const cv = await prisma.cv.create({
    data: {
      userId: req.userId,
      title,
      templateId: templateId || 'default',
      content: content || {},
    },
  });
  res.status(201).json(cv);
});

app.get('/api/cvs/:id', requireAuth, async (req: Request & { userId: string }, res: Response, next: NextFunction) => {
  const cv = await prisma.cv.findUnique({ where: { id: req.params.id } });
  if (!cv || cv.userId !== req.userId) {
    return res.status(404).json({ error: 'CV not found' });
  }
  res.json(cv);
});

app.put('/api/cvs/:id', requireAuth, async (req: Request & { userId: string }, res: Response, next: NextFunction) => {
  const { title, templateId, content } = req.body;
  const cv = await prisma.cv.findUnique({ where: { id: req.params.id } });
  if (!cv || cv.userId !== req.userId) {
    return res.status(404).json({ error: 'CV not found' });
  }
  const updated = await prisma.cv.update({
    where: { id: req.params.id },
    data: {
      ...(title && { title }),
      ...(templateId && { templateId }),
      ...(content && { content }),
      version: { increment: 1 },
    },
  });
  res.json(updated);
});

app.delete('/api/cvs/:id', requireAuth, async (req: Request & { userId: string }, res: Response, next: NextFunction) => {
  const cv = await prisma.cv.findUnique({ where: { id: req.params.id } });
  if (!cv || cv.userId !== req.userId) {
    return res.status(404).json({ error: 'CV not found' });
  }
  await prisma.cv.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

app.post('/api/cvs/:id/autosave', requireAuth, async (req: Request & { userId: string }, res: Response, next: NextFunction) => {
  const { content, version, title } = req.body;
  const cv = await prisma.cv.findUnique({ where: { id: req.params.id } });
  if (!cv || cv.userId !== req.userId) {
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
    where: { id: req.params.id },
    data: updateData,
  });
  res.json(updated);
});

// Start
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
