'use client';

import { useState } from 'react';
import api from '@/lib/api';
import Button from './Button';

const templates = [
  { id: 'tech', name: 'Technology', industry: 'Tech' },
  { id: 'finance', name: 'Finance', industry: 'Finance' },
  { id: 'creative', name: 'Creative', industry: 'Creative' },
  { id: 'healthcare', name: 'Healthcare', industry: 'Healthcare' },
  { id: 'education', name: 'Education', industry: 'Education' },
  { id: 'engineering', name: 'Engineering', industry: 'Engineering' },
  { id: 'sales', name: 'Sales', industry: 'Sales' },
  { id: 'customer-service', name: 'Customer Service', industry: 'Customer Service' },
  { id: 'retail', name: 'Retail', industry: 'Retail' },
  { id: 'government', name: 'Government', industry: 'Government' },
];

export default function TemplatePicker({ onCreated }: { onCreated: (cv: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = async (templateId: string) => {
    try {
      const res = await api.post('/cvs', { title: `CV - ${new Date().toLocaleDateString()}`, templateId });
      onCreated(res.data);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to create CV', err);
      alert('Failed to create CV');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <h2>Choose a Template</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
        {templates.map(t => (
          <div key={t.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleSelect(t.id)}>
            <h4>{t.name}</h4>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>{t.industry}</p>
          </div>
        ))}
      </div>
      <Button onClick={() => setIsOpen(false)} style={{ marginTop: '1rem' }}>Cancel</Button>
    </Modal>
  );
}
