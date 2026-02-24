'use client';

import { useState } from 'react';
import api from '@/lib/api';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

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

interface TemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (cv: any) => void;
}

export default function TemplatePicker({ isOpen, onClose, onCreated }: TemplatePickerProps) {
  const handleSelect = async (templateId: string) => {
    try {
      const res = await api.post('/cvs', { title: `CV - ${new Date().toLocaleDateString()}`, templateId });
      onCreated(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to create CV', err);
      alert('Failed to create CV');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Choose a Template</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
        {templates.map(t => (
          <div key={t.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleSelect(t.id)}>
            <h4>{t.name}</h4>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>{t.industry}</p>
          </div>
        ))}
      </div>
      <Button onClick={onClose} style={{ marginTop: '1rem' }}>Cancel</Button>
    </Modal>
  );
}
