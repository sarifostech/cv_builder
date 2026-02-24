import React from 'react';
import Button from '../Button';
import { ExperienceItem as ExpItem } from '@/types/cv';

interface ExperienceFormProps {
  data: ExpItem[];
  onChange: (data: ExpItem[]) => void;
  onAdd?: () => void;
  onDeleteSection?: () => void;
}

export default function ExperienceForm({ data, onChange, onAdd, onDeleteSection }: ExperienceFormProps) {
  const addExperience = () => {
    const newItem: ExpItem = {
      id: Date.now().toString(),
      company: '',
      title: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onChange([...data, newItem]);
  };

  const updateExperience = (id: string, updates: Partial<ExpItem>) => {
    onChange(data.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const deleteExperience = (id: string) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(onDeleteSection || onAdd) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold' }}>Work Experience</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onAdd && <Button size="sm" onClick={onAdd}>Add</Button>}
            {onDeleteSection && <Button size="sm" variant="danger" onClick={onDeleteSection}>Delete Section</Button>}
          </div>
        </div>
      )}
      {data.map((exp) => (
        <div key={exp.id} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.5rem', position: 'relative' }}>
          {data.length > 1 && (
            <button type="button" onClick={() => deleteExperience(exp.id)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Delete</button>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem' }}>Job Title</label>
              <input
                type="text"
                value={exp.title}
                onChange={e => updateExperience(exp.id, { title: e.target.value })}
                placeholder="e.g., Software Engineer"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem' }}>Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={e => updateExperience(exp.id, { company: e.target.value })}
                placeholder="Company name"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem' }}>Start Date</label>
              <input
                type="date"
                value={exp.startDate}
                onChange={e => updateExperience(exp.id, { startDate: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem' }}>End Date (optional)</label>
              <input
                type="date"
                value={exp.endDate || ''}
                onChange={e => updateExperience(exp.id, { endDate: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem' }}>Description</label>
            <textarea
              value={exp.description}
              onChange={e => updateExperience(exp.id, { description: e.target.value })}
              placeholder="Describe your responsibilities and achievements"
              rows={4}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
