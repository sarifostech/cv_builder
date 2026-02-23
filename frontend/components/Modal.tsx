'use client';

import { ReactNode, useState } from 'react';

export default function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: ReactNode }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '90%', maxHeight: '90%', overflow: 'auto' }}>
        <button onClick={onClose} style={{ float: 'right' }}>X</button>
        {children}
      </div>
    </div>
  );
}
