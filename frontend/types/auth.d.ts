import { User } from '@/context/AuthContext';

declare module '@/context/AuthContext' {
  interface User {
    role?: string;
  }
}