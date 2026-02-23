export default function Input({ label, type = 'text', value, onChange }: { label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label style={{ display: 'block', marginBottom: '1rem' }}>
      {label}
      <input type={type} value={value} onChange={onChange} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
    </label>
  );
}
