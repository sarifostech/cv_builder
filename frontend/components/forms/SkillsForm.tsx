import React, { useState } from 'react';
import Button from '../Button';

interface SkillsFormProps {
  data: { items: string[] };
  onChange: (data: { items: string[] }) => void;
  onAdd?: () => void;
  onDeleteSection?: () => void;
}

export default function SkillsForm({ data, onChange, onAdd, onDeleteSection }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !data.items.includes(trimmed)) {
      onChange({ items: [...data.items, trimmed] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    onChange({ items: data.items.filter(s => s !== skill) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(onDeleteSection || onAdd) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold' }}>Skills</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onAdd && <Button size="sm" onClick={onAdd}>Add</Button>}
            {onDeleteSection && <Button size="sm" variant="danger" onClick={onDeleteSection}>Delete Section</Button>}
          </div>
        </div>
      )}
      {!onAdd && !onDeleteSection && <label style={{ fontWeight: 'bold' }}>Skills</label>}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={newSkill}
          onChange={e => setNewSkill(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
          placeholder="Add a skill"
          style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <Button size="sm" onClick={addSkill}>Add</Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {data.items.map(skill => (
          <span key={skill} style={{ background: '#e5e7eb', padding: '0.25rem 0.75rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {skill}
            <button type="button" onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}
