'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext, useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Button from '@/components/Button';

interface Cv {
  id: string;
  title: string;
  templateId: string;
  content: any;
  version?: number;
}

export default function BuilderPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [cv, setCv] = useState<Cv | null>(null);
  const [title, setTitle] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    api.get(`/cvs/${params.id}`).then(res => {
      const data = res.data;
      setCv(data);
      setTitle(data.title);
    }).catch(() => router.push('/dashboard'));
  }, [user, params.id, router]);

  const autoSave = useCallback(async (newTitle?: string) => {
    if (!cv) return;
    try {
      const payload: any = {};
      if (newTitle !== undefined) payload.title = newTitle;
      if (cv.content) payload.content = cv.content;
      if (cv.version !== undefined) payload.version = cv.version;
      const res = await api.post(`/cvs/${cv.id}/autosave`, payload);
      setCv(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save failed', err);
    }
  }, [cv]);

  useEffect(() => {
    if (!cv) return;
    const timer = setTimeout(() => {
      autoSave();
    }, 2000);
    return () => clearTimeout(timer);
  }, [cv?.content, autoSave]);

  const updateContent = (updater: any) => {
    setCv(cv => ({ ...cv!, content: updater(cv?.content) }));
  };

  if (!cv) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          value={title}
          onChange={e => { setTitle(e.target.value); autoSave(e.target.value); }}
          style={{ fontSize: '1.5rem', fontWeight: 'bold', border: 'none', background: 'transparent' }}
        />
        <span style={{ color: saved ? 'green' : 'gray' }}>{saved ? 'Saved' : 'Saving...'}</span>
      </header>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <aside style={{ width: '250px' }}>
          <h3>Sections</h3>
          <ul>
            <li>Personal Info</li>
            <li>Summary</li>
            <li>Experience</li>
            <li>Education</li>
            <li>Skills</li>
            <li>Projects</li>
          </ul>
        </aside>
        <main style={{ flex: 1 }}>
          <h4>Preview</h4>
          <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{JSON.stringify(cv.content, null, 2)}</pre>
        </main>
      </div>
    </div>
  );
}

BuilderPage.getLayout = function PageLayout(page: React.ReactElement) {
  return <AuthContext.Provider>{page}</AuthContext.Provider>;
};
