'use client';

import React, { useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (mode: 'ats' | 'visual' | 'both') => void;
  userRole: 'free' | 'pro';
}

export default function ExportModal({ isOpen, onClose, onExport, userRole }: ExportModalProps) {
  const [selectedMode, setSelectedMode] = useState<'ats' | 'visual' | 'both'>('ats');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onExport(selectedMode);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Export failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getModeOptions = () => {
    if (userRole === 'pro') {
      return [
        { value: 'ats' as const, label: 'ATS-Safe PDF', description: 'Optimized for Applicant Tracking Systems' },
        { value: 'visual' as const, label: 'Visual PDF', description: 'Designed for human readers' },
        { value: 'both' as const, label: 'Both Formats', description: 'Download both ATS-Safe and Visual versions' },
      ];
    }
    return [
      { value: 'ats' as const, label: 'ATS-Safe PDF', description: 'Optimized for Applicant Tracking Systems' },
    ];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export PDF" size="md">
      <div>
        <p className="text-gray-600">Choose the PDF format(s) you want to export:</p>
        <div>
          {getModeOptions().map((option) => (
            <div key={option.value} style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
              <input
                type="radio"
                id={`export-mode-${option.value}`}
                name="export-mode"
                value={option.value}
                checked={selectedMode === option.value}
                onChange={() => setSelectedMode(option.value)}
                disabled={userRole === 'free' && option.value !== 'ats'}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor={`export-mode-${option.value}`} style={{ flex: 1, cursor: userRole === 'free' && option.value !== 'ats' ? 'not-allowed' : 'pointer', opacity: userRole === 'free' && option.value !== 'ats' ? 0.6 : 1 }}>
                <div style={{ fontWeight: 500 }}>{option.label}</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{option.description}</div>
              </label>
              {userRole === 'free' && option.value !== 'ats' && (
                <span
                  style={{ color: '#2563eb', cursor: 'pointer', fontSize: '0.85rem' }}
                  onClick={() => {
                    // Upgrade action could navigate to pricing page
                    alert('Upgrade to Pro to export this format');
                  }}
                >
                  Upgrade
                </span>
              )}
            </div>
          ))}
        </div>
        {userRole === 'free' && selectedMode !== 'ats' && (
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '0.25rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e' }}>
              <strong>Upgrade to Pro</strong> to export Visual PDFs and both formats.
            </p>
          </div>
        )}
        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '0.25rem', color: '#b91c1c', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleExport} disabled={isLoading || (userRole === 'free' && selectedMode !== 'ats')}>
            {isLoading ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}