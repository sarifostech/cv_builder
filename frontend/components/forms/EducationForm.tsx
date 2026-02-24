import React from 'react';
import Button from '../Button';
import { EducationItem } from '@/types/cv';

interface EducationFormProps {
  data: EducationItem[];
  onChange: (data: EducationItem[]) => void;
}

export default function EducationForm({ data, onChange }: EducationFormProps) {
  const addEducation = () => {
    const newItem: EducationItem = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onChange([...data, newItem]);
  };

  const updateEducation = (id: string, updates: Partial<EducationItem>) => {
    onChange(data.map(ed => ed.id === id ? { ...ed, ...updates } : ed));
  };

  const deleteEducation = (id: string) => {
    onChange(data.filter(ed => ed.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontWeight: 'bold' }}>Education</label>
        <Button size="sm" onClick={addEducation}>Add Education</Button>
      </div>
      {data.map((edu) => (
        <div key={edu.id} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.5rem', position: 'relative' }}>
          {data.length > 1 && (
            <button type="button" onClick={() => deleteEducation(edu.id)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Delete</button>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem' }}>Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={e => updateEducation(edu.id, { institution: e.target.value })}
                placeholder="School or university"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem' }}>Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={e => updateEducation(edu.id, { degree: e.target.value })}
                placeholder="e.g., B.Sc. Computer Science"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem' }}>Start Date</label>
              <input
                type="date"
                value={edu.startDate}
                onChange={e => updateEducation(edu.id, { startDate: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem' }}>End Date (optional)</label>
              <input
                type="date"
                value={edu.endDate || ''}
                onChange={e => updateEducation(edu.id, { endDate: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.875rem' }}>Description (optional)</label>
            <textarea
              value={edu.description || ''}
              onChange={e => updateEducation(edu.id, { description: e.target.value })}
              placeholder="Additional details, honors, etc."
              rows={3}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
