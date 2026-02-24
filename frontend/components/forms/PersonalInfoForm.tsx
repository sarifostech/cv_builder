import React from 'react';
import Input from '../Input';
import { PersonalInfo } from '@/types/cv';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const update = (field: keyof PersonalInfo, val: string) => {
    onChange({ ...data, [field]: val });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input label="Full Name *" value={data.fullName} onChange={e => update('fullName', e.target.value)} />
      <Input label="Email *" type="email" value={data.email} onChange={e => update('email', e.target.value)} />
      <Input label="Phone *" value={data.phone} onChange={e => update('phone', e.target.value)} />
      <Input label="Location" value={data.location || ''} onChange={e => update('location', e.target.value)} />
    </div>
  );
}
