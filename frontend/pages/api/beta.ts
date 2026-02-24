import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  const filePath = path.join(process.cwd(), 'beta_invites.txt');
  const timestamp = new Date().toISOString();
  const line = `${timestamp} ${email}\n`;
  try {
    await fs.appendFile(filePath, line, { encoding: 'utf8' });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Beta write error:', err);
    res.status(500).json({ error: 'Failed to record invite' });
  }
}
