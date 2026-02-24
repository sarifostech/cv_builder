'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { CvContent, createEmptyCvContent } from '../types/cv';
import PersonalInfoForm from '../components/forms/PersonalInfoForm';
import SummaryForm from '../components/forms/SummaryForm';
import ExperienceForm from '../components/forms/ExperienceForm';
import EducationForm from '../components/forms/EducationForm';
import SkillsForm from '../components/forms/SkillsForm';
import ProjectsForm from '../components/forms/ProjectsForm';
import PreviewPane from '../components/PreviewPane';
import Button from '../components/Button';

// Use dynamic import with no SSR to avoid hydration issues
const TemplatePicker = dynamic(() => import('../components/TemplatePicker'), { ssr: false });

type SectionKey = 'personalInfo' | 'summary' | 'experience' | 'education' | 'skills' | 'projects';

const SECTION_LABELS: Record<SectionKey, string> = {
  personalInfo: 'Personal Info',
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
};

export default function BuilderPage() {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();

  const [cvContent, setCvContent] = useState<CvContent>(createEmptyCvContent());
  const [activeSection, setActiveSection] = useState<SectionKey>('personalInfo');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [version, setVersion] = useState<number>(0);
  const [previewMode, setPreviewMode] = useState<'ats' | 'visual'>('visual');
  const [error, setError] = useState<string | null>(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Debounce timer ref
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceMs = 2000;

  // Load CV content on mount
  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const loadCv = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/cvs/${id}`);
        const data = res.data as { content: CvContent; version: number; updatedAt?: string };
        setCvContent(data.content);
        setVersion(data.version);
        if (data.updatedAt) {
          setLastSaved(new Date(data.updatedAt).toLocaleString());
        }
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadCv();
  }, [id]);

  // Trigger autosave when content changes
  useEffect(() => {
    if (!id || typeof id !== 'string' || loading) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const res = await api.post(`/cvs/${id}/autosave`, {
          content: cvContent,
          version,
        });
        const response = res.data as { updatedAt?: string };

        // Update version and last saved time
        setVersion(v => v + 1);
        if (response.updatedAt) {
          setLastSaved(new Date(response.updatedAt).toLocaleString());
        }
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setSaving(false);
      }
    }, debounceMs);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [cvContent, version, id, loading]);

  const updateSection = useCallback(<K extends SectionKey>(
    section: K,
    data: Partial<CvContent[K]>
  ) => {
    setCvContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  }, []);

  const renderForm = (section: SectionKey) => {
    switch (section) {
      case 'personalInfo':
        return (
          <PersonalInfoForm
            data={cvContent.personalInfo}
            onChange={(data) => updateSection('personalInfo', data)}
          />
        );
      case 'summary':
        return (
          <SummaryForm
            data={cvContent.summary}
            onChange={(data) => updateSection('summary', data)}
          />
        );
      case 'experience':
        return (
          <ExperienceForm
            data={cvContent.experience}
            onChange={(data) => updateSection('experience', data)}
          />
        );
      case 'education':
        return (
          <EducationForm
            data={cvContent.education}
            onChange={(data) => updateSection('education', data)}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            data={cvContent.skills}
            onChange={(data) => updateSection('skills', data)}
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            data={cvContent.projects}
            onChange={(data) => updateSection('projects', data)}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ color: '#6b7280' }}>Loading CV...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ color: '#dc2626', background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Error</h2>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button variant="secondary" size="sm" onClick={() => router.push('/dashboard')}>
              ← Back
            </Button>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>CV Builder</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {saving && (
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Saving...</span>
            )}
            {lastSaved && (
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Last saved: {lastSaved}</span>
            )}
            <Button variant="secondary" size="sm" onClick={() => setShowTemplatePicker(true)}>
              New from Template
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', maxWidth: '1024px', margin: '0 auto', width: '100%' }}>
        {/* Sidebar */}
        <aside style={{ width: '16rem', background: 'white', borderRight: '1px solid #e5e7eb', overflowY: 'auto', display: { sm: 'none', md: 'flex' }, flexDirection: 'column' }}>
          <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {(Object.keys(SECTION_LABELS) as SectionKey[]).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                style={{
                  textAlign: 'left',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  border: 'none',
                  background: activeSection === section ? '#eff6ff' : 'transparent',
                  color: activeSection === section ? '#2563eb' : '#374151',
                  cursor: 'pointer',
                }}
              >
                {SECTION_LABELS[section]}
              </button>
            ))}
          </nav>
        </aside>

        {/* Editor & Preview Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', lg: 'flex-row', overflow: 'hidden' }}>
          {/* Editor */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', maxWidth: { md: '48rem' } }}>
            <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
                {SECTION_LABELS[activeSection]}
              </h2>
              {renderForm(activeSection)}
            </div>
          </main>

          {/* Preview Pane */}
          <aside style={{ lg: 'w-96', borderLeft: '1px solid #e5e7eb', background: '#f9fafb', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <PreviewPane
              content={cvContent}
              mode={previewMode}
              onModeChange={setPreviewMode}
            />
          </aside>
        </div>
      </div>

      {/* Template Picker Modal */}
      {showTemplatePicker && (
        <TemplatePicker
          isOpen={showTemplatePicker}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}
    </div>
  );
}
