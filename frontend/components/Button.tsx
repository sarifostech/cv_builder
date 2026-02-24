interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export default function Button({ children, onClick, style, size = 'md', variant = 'primary', className }: ButtonProps) {
  const padding = size === 'sm' ? '0.25rem 0.75rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.5rem 1rem';
  const bgColors: Record<string, { bg: string; color: string; border?: string }> = {
    primary: { bg: '#2563eb', color: 'white' },
    secondary: { bg: 'white', color: '#2563eb', border: '1px solid #2563eb' },
    danger: { bg: '#dc2626', color: 'white' },
  };
  const { bg, color, border } = bgColors[variant];
  return (
    <button onClick={onClick} style={{ padding, cursor: 'pointer', background: bg, color, border, borderRadius: '0.375rem', ...style }} className={className}>
      {children}
    </button>
  );
}
