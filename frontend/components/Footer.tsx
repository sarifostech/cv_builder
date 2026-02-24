'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '2rem 1rem', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>© {new Date().getFullYear()} CV Creator. All rights reserved.</p>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>Home</Link>
          <Link href="/beta" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>Beta</Link>
        </nav>
      </div>
    </footer>
  );
}
