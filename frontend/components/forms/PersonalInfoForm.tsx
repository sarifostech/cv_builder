import React from 'react';
import Input from '../Input';
import { PersonalInfo } from '@/types/cv';

interface PersonalInfoFormProps {
  value: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export default function PersonalInfoForm({ value, onChange }: PersonalInfoFormProps) {
  const update = (field: keyof PersonalInfo, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input label="Full Name *" value={value.fullName} onChange={e => update('fullName', e.target.value)} />
      <Input label="Email *" type="email" value={value.email} onChange={e => update('email', e.target.value)} />
      <Input label="Phone *" value={value.phone} onChange={e => update('phone', e.target.value)} />
      <Input label="Location" value={value.location || ''} onChange={e => update('location', e.target.value)} />
    </div>
  );
}
