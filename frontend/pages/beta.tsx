import { useState } from 'react';
import Head from 'next/head';
import Button from '@/components/Button';

export default function Beta() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/beta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch (err) {
      setError('Could not submit. Please try again later.');
    }
  };

  return (
    <>
      <Head>
        <title>Beta Invite – CV Creator</title>
      </Head>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: '2rem' }}>
        <div style={{ maxWidth: '28rem', width: '100%', background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Request Beta Invite</h1>
          {submitted ? (
            <p style={{ color: '#16a34a' }}>Thanks! You’re on the list. We’ll be in touch soon.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                />
              </div>
              {error && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}
              <Button type="submit" className="w-full justify-center">Request Invite</Button>
            </form>
          )}
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
            We’ll never share your email. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </>
  );
}
