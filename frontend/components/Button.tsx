interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

export default function Button({ children, onClick, style, size = 'md', variant = 'primary', className, disabled = false }: ButtonProps) {
  const padding = size === 'sm' ? '0.25rem 0.75rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.5rem 1rem';
  const bgColors: Record<string, { bg: string; color: string; border?: string }> = {
    primary: { bg: '#2563eb', color: 'white' },
    secondary: { bg: 'white', color: '#2563eb', border: '1px solid #2563eb' },
    danger: { bg: '#dc2626', color: 'white' },
  };
  const { bg, color, border } = bgColors[variant];
  const btnStyle: React.CSSProperties = {
    padding,
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#9ca3af' : bg,
    color: disabled ? 'white' : color,
    border: disabled ? '1px solid #9ca3af' : border,
    borderRadius: '0.375rem',
    ...style,
  };
  return (
    <button onClick={onClick} disabled={disabled} style={btnStyle} className={className}>
      {children}
    </button>
  );
}
