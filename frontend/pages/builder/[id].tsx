'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { CvContent, createEmptyCvContent } from '@/types/cv';
import type { ExperienceItem, EducationItem, ProjectsItem } from '@/types/cv';
import PersonalInfoForm from '../../components/forms/PersonalInfoForm';
import SummaryForm from '../../components/forms/SummaryForm';
import ExperienceForm from '../../components/forms/ExperienceForm';
import EducationForm from '../../components/forms/EducationForm';
import SkillsForm from '../../components/forms/SkillsForm';
import ProjectsForm from '../../components/forms/ProjectsForm';
import PreviewPane from '../../components/PreviewPane';
import Button from '../../components/Button';
import ExportModal from '../../components/ExportModal';
import AITipsPanel from '@/components/AITipsPanel';

const TemplatePicker = dynamic(() => import('../../components/TemplatePicker'), { ssr: false });

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
  const { token, user } = useAuth();

  const [cvContent, setCvContent] = useState<CvContent>(createEmptyCvContent());
  const [title, setTitle] = useState('');
  const [activeSection, setActiveSection] = useState<SectionKey>('personalInfo');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [version, setVersion] = useState<number>(0);
  const [previewMode, setPreviewMode] = useState<'ats' | 'visual'>('visual');
  const [error, setError] = useState<string | null>(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
const [showExportModal, setShowExportModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const industry = 'technology'; // default; can be derived from user profile later

  // Track focused input globally for AI suggestion insertion
  useEffect(() => {
    const handleFocus = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        activeInputRef.current = target as HTMLInputElement | HTMLTextAreaElement;
      }
    };
    window.addEventListener('focus', handleFocus, true);
    return () => window.removeEventListener('focus', handleFocus, true);
  }, []);

  // Debounce timer ref
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceMs = 2000;

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load CV content on mount
  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const loadCv = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/cvs/${id}`);
        const data = res.data as { title: string; content: CvContent; version: number; updatedAt?: string };
        setTitle(data.title);
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

  // Unified autosave for both content and title
  useEffect(() => {
    if (!id || typeof id !== 'string' || loading) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const res = await api.post(`/cvs/${id}/autosave`, {
          title,
          content: cvContent,
          version,
        });
        const data = res.data as { version: number; updatedAt?: string };
        setVersion(data.version);
        if (data.updatedAt) {
          setLastSaved(new Date(data.updatedAt).toLocaleString());
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
  }, [cvContent, version, title, id, loading]);

  const updateSection = useCallback(<K extends SectionKey>(
    section: K,
    data: Partial<CvContent[K]>
  ) => {
    setCvContent((prev: CvContent) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  }, []);

  const addExperience = () => {
    const newItem = { id: Date.now().toString(), company: '', title: '', startDate: '', endDate: '', description: '' };
    updateSection('experience', [...cvContent.experience, newItem] as any);
    setActiveSection('experience');
  };

  const addEducation = () => {
    const newItem = { id: Date.now().toString(), institution: '', degree: '', startDate: '', endDate: '', description: '' };
    updateSection('education', [...cvContent.education, newItem] as any);
    setActiveSection('education');
  };

  const addSkill = () => {
    updateSection('skills', { items: [...cvContent.skills.items, ''] } as any);
    setActiveSection('skills');
  };

  const addProject = () => {
    const newItem = { id: Date.now().toString(), name: '', description: '', link: '' };
    updateSection('projects', [...cvContent.projects, newItem] as any);
    setActiveSection('projects');
  };

  const handleAISuggestion = (suggestion: string) => {
    const input = activeInputRef.current;
    if (!input) {
      alert('Please focus a text field first');
      return;
    }
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const newValue = input.value.slice(0, start) + suggestion + input.value.slice(end);
    input.value = newValue;
    input.selectionStart = input.selectionEnd = start + suggestion.length;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const deleteSection = (section: SectionKey) => {
    if (!window.confirm('Delete this entire section?')) return;
    switch (section) {
      case 'personalInfo':
        updateSection('personalInfo', { fullName: '', email: '', phone: '', location: '' } as any);
        break;
      case 'summary':
        updateSection('summary', { text: '' } as any);
        break;
      case 'experience':
        updateSection('experience', [] as any);
        break;
      case 'education':
        updateSection('education', [] as any);
        break;
      case 'skills':
        updateSection('skills', { items: [] } as any);
        break;
      case 'projects':
        updateSection('projects', [] as any);
        break;
    }
  };

  const renderForm = (section: SectionKey) => {
    switch (section) {
      case 'personalInfo':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>{SECTION_LABELS[section]}</h3>
              <Button size="sm" variant="danger" onClick={() => deleteSection(section)}>Delete Section</Button>
            </div>
            <PersonalInfoForm
              data={cvContent.personalInfo}
              onChange={(data) => updateSection('personalInfo', data)}
            />
          </div>
        );
      case 'summary':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>{SECTION_LABELS[section]}</h3>
              <Button size="sm" variant="danger" onClick={() => deleteSection(section)}>Delete Section</Button>
            </div>
            <SummaryForm
              data={cvContent.summary}
              onChange={(data) => updateSection('summary', data)}
            />
          </div>
        );
      case 'experience':
        return (
          <ExperienceForm
            data={cvContent.experience}
            onChange={(data) => updateSection('experience', data)}
            onAdd={addExperience}
            onDeleteSection={() => deleteSection('experience')}
          />
        );
      case 'education':
        return (
          <EducationForm
            data={cvContent.education}
            onChange={(data) => updateSection('education', data)}
            onAdd={addEducation}
            onDeleteSection={() => deleteSection('education')}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            data={cvContent.skills}
            onChange={(data) => updateSection('skills', data)}
            onAdd={addSkill}
            onDeleteSection={() => deleteSection('skills')}
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            data={cvContent.projects}
            onChange={(data) => updateSection('projects', data)}
            onAdd={addProject}
            onDeleteSection={() => deleteSection('projects')}
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
        <div style={{ color: '#dc2626', background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Error</h2>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button variant="secondary" size="sm" onClick={() => router.push('/dashboard')}>← Back</Button>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="CV Title"
              style={{ fontSize: '1.125rem', fontWeight: '600', border: 'none', background: 'transparent', color: '#111827', minWidth: '200px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {saving && <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Saving...</span>}
            {lastSaved && <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Last saved: {lastSaved}</span>}
            <Button variant="secondary" size="sm" onClick={() => setShowTemplatePicker(true)}>New from Template</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowAIPanel(o => !o)}>AI Tips</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', maxWidth: '1024px', margin: '0 auto', width: '100%' }}>
        {/* Sidebar */}
        <aside style={{ width: isMobile ? '100%' : '16rem', background: 'white', borderRight: '1px solid #e5e7eb', overflowY: 'auto', display: isMobile ? 'none' : 'flex', flexDirection: 'column' }}>
          <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {(Object.keys(SECTION_LABELS) as SectionKey[]).map((section) => (
              <div key={section} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setActiveSection(section)}
                  style={{
                    flex: 1,
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
                {/* Add button only for multi-entry sections */}
                {(section === 'experience' || section === 'education' || section === 'skills' || section === 'projects') && (
                  <button
                    onClick={() => {
                      if (section === 'experience') addExperience();
                      else if (section === 'education') addEducation();
                      else if (section === 'skills') addSkill();
                      else if (section === 'projects') addProject();
                    }}
                    style={{ padding: '0.25rem 0.5rem', border: '1px solid #ddd', background: 'white', borderRadius: '0.25rem', cursor: 'pointer' }}
                    title="Add new item"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </nav>
          {/* Mobile navigation: if mobile, show horizontal scrollable tabs? For now, hide sidebar on mobile and we'll stack editor/preview */}
        </aside>

        {/* Editor & Preview Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden' }}>
          {/* Editor */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', maxWidth: isMobile ? '100%' : '48rem' }}>
            <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
                {SECTION_LABELS[activeSection]}
              </h2>
              {renderForm(activeSection)}
            </div>
          </main>

          {/* Preview Pane */}
          <aside style={{ width: isMobile ? '100%' : '24rem', borderLeft: isMobile ? 'none' : '1px solid #e5e7eb', borderTop: isMobile ? '1px solid #e5e7eb' : 'none', background: '#f9fafb', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
          onCreated={(cv) => router.push(`/builder/${cv.id}`)}
        />
      )}
      {showAIPanel && (
        <AITipsPanel industry={industry} section={activeSection} onSelect={handleAISuggestion} />
      )}

      {/* Mobile bottom navigation */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          overflowX: 'auto',
          alignItems: 'center',
          padding: '0 0.5rem',
          gap: '0.5rem',
          zIndex: 40,
        }}>
          {(Object.keys(SECTION_LABELS) as SectionKey[]).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              style={{
                flexShrink: 0,
                padding: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: activeSection === section ? 600 : 400,
                color: activeSection === section ? '#2563eb' : '#6b7280',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {SECTION_LABELS[section]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
