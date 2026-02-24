import React from 'react';
import { CvContent } from '@/types/cv';

interface PreviewPaneProps {
  content: CvContent;
  mode: 'ats' | 'visual';
  onModeChange: (mode: 'ats' | 'visual') => void;
}

export default function PreviewPane({ content, mode, onModeChange }: PreviewPaneProps) {
  const { personalInfo, summary, experience, education, skills, projects } = content;

  // Simple ATS-safe plain text rendering
  const renderATS = () => (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '1rem' }}>
      <h2>{personalInfo.fullName || 'Your Name'}</h2>
      <p>{personalInfo.email} | {personalInfo.phone} {personalInfo.location && `| ${personalInfo.location}`}</p>
      <hr />
      <h3>Summary</h3>
      <p>{summary.text}</p>
      <h3>Experience</h3>
      {experience.map((exp, idx) => (
        <div key={exp.id || idx}>
          <strong>{exp.title} at {exp.company}</strong>
          <br />
          <em>{exp.startDate} - {exp.endDate || 'Present'}</em>
          <p>{exp.description}</p>
        </div>
      ))}
      <h3>Education</h3>
      {education.map((edu, idx) => (
        <div key={edu.id || idx}>
          <strong>{edu.degree} at {edu.institution}</strong>
          <br />
          <em>{edu.startDate} - {edu.endDate || 'Present'}</em>
          {edu.description && <p>{edu.description}</p>}
        </div>
      ))}
      <h3>Skills</h3>
      <p>{skills.items.join(', ')}</p>
      <h3>Projects</h3>
      {projects.map((proj, idx) => (
        <div key={proj.id || idx}>
          <strong>{proj.name}</strong>
          {proj.link && <span> - <a href={proj.link}>{proj.link}</a></span>}
          <p>{proj.description}</p>
        </div>
      ))}
    </div>
  );

  // Visual mode: apply some basic styling
  const renderVisual = () => (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#2563eb' }}>{personalInfo.fullName || 'Your Name'}</h2>
        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#555' }}>
          {personalInfo.email} | {personalInfo.phone} {personalInfo.location && `| ${personalInfo.location}`}
        </p>
      </div>

      {summary.text && (
        <section style={{ marginBottom: '1rem' }}>
          <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.25rem', color: '#2563eb' }}>Summary</h3>
          <p>{summary.text}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section style={{ marginBottom: '1rem' }}>
          <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.25rem', color: '#2563eb' }}>Experience</h3>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{exp.title}</strong>
                <span style={{ color: '#555' }}>{exp.startDate} - {exp.endDate || 'Present'}</span>
              </div>
              <div style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>{exp.company}</div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section style={{ marginBottom: '1rem' }}>
          <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.25rem', color: '#2563eb' }}>Education</h3>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{edu.degree}</strong>
                <span style={{ color: '#555' }}>{edu.startDate} - {edu.endDate || 'Present'}</span>
              </div>
              <div style={{ fontStyle: 'italic' }}>{edu.institution}</div>
              {edu.description && <p>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {skills.items.length > 0 && (
        <section style={{ marginBottom: '1rem' }}>
          <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.25rem', color: '#2563eb' }}>Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {skills.items.map((skill, idx) => (
              <span key={idx} style={{ background: '#e0e7ff', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.25rem', color: '#2563eb' }}>Projects</h3>
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <strong>{proj.name}</strong>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontSize: '0.875rem' }}>
                    {proj.link}
                  </a>
                )}
              </div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{proj.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: mode === 'ats' ? '#f9fafb' : '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
      <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={() => onModeChange('ats')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: mode === 'ats' ? 'bold' : 'normal', color: mode === 'ats' ? '#2563eb' : '#555' }}
        >
          ATS-Safe
        </button>
        <button
          onClick={() => onModeChange('visual')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: mode === 'visual' ? 'bold' : 'normal', color: mode === 'visual' ? '#2563eb' : '#555' }}
        >
          Visual
        </button>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#888' }}>Preview</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {mode === 'ats' ? renderATS() : renderVisual()}
      </div>
    </div>
  );
}
