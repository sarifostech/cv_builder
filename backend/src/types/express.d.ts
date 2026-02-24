import { Request } from 'express';

// Extend Express Request interface to include userId from authentication
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export type { AuthenticatedRequest };
