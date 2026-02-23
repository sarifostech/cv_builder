export default function Button({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{ padding: '0.5rem 1rem', cursor: 'pointer', ...style }}>
      {children}
    </button>
  );
}
