import React from 'react';

interface SummaryFormProps {
  data: { text: string };
  onChange: (data: { text: string }) => void;
}

export default function SummaryForm({ data, onChange }: SummaryFormProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label style={{ fontWeight: 'bold' }}>Professional Summary</label>
      <textarea
        value={data.text}
        onChange={e => onChange({ text: e.target.value.slice(0, 500) })}
        placeholder="A brief summary of your professional background and objectives (max 500 characters)."
        rows={6}
        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
      />
      <div style={{ fontSize: '0.85rem', color: '#666' }}>
        {data.text.length}/500 characters
      </div>
    </div>
  );
}
