'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import TemplatePicker from '@/components/TemplatePicker';
import Button from '@/components/Button';

interface Cv {
  id: string;
  title: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [cvs, setCvs] = useState<Cv[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    api.get('/cvs').then(res => setCvs(res.data)).catch(() => {
      // ignore
    });
  }, [user, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this CV?')) return;
    await api.delete(`/cvs/${id}`);
    setCvs(cvs.filter(c => c.id !== id));
  };

  if (!user) return null;

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <button onClick={logout}>Log Out</button>
      </header>
      <Button onClick={() => document.getElementById('template-picker')?.classList.remove('hidden')}>Create New CV</Button>
      <TemplatePicker onCreated={(cv) => router.push(`/builder/${cv.id}`)} />
      <ul style={{ marginTop: '2rem' }}>
        {cvs.map(cv => (
          <li key={cv.id} style={{ marginBottom: '1rem' }} data-testid="cv-item">
            <strong>{cv.title}</strong> — {new Date(cv.updatedAt).toLocaleDateString()}
            <button onClick={() => router.push(`/builder/${cv.id}`)}>Edit</button>
            <button onClick={() => handleDelete(cv.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
