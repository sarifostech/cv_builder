import React from 'react';
import Button from '../Button';

interface ProjectsItem {
  id: string;
  name: string;
  description: string;
  link?: string;
}

interface ProjectsFormProps {
  data: ProjectsItem[];
  onChange: (data: ProjectsItem[]) => void;
  onAdd?: () => void;
  onDeleteSection?: () => void;
}

export default function ProjectsForm({ data, onChange, onAdd, onDeleteSection }: ProjectsFormProps) {
  const addProject = () => {
    const newItem: ProjectsItem = { id: Date.now().toString(), name: '', description: '', link: '' };
    onChange([...data, newItem]);
  };

  const updateProject = (id: string, updates: Partial<ProjectsItem>) => {
    onChange(data.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    onChange(data.filter(p => p.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(onDeleteSection || onAdd) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold' }}>Projects</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onAdd && <Button size="sm" onClick={onAdd}>Add</Button>}
            {onDeleteSection && <Button size="sm" variant="danger" onClick={onDeleteSection}>Delete Section</Button>}
          </div>
        </div>
      )}
      {!onAdd && !onDeleteSection && <label style={{ fontWeight: 'bold' }}>Projects</label>}
      <Button size="sm" onClick={addProject} style={{ alignSelf: 'flex-end' }}>Add Project</Button>
      {data.map((project, idx) => (
        <div key={project.id} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.5rem', position: 'relative' }}>
          {data.length > 1 && (
            <button type="button" onClick={() => deleteProject(project.id)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Delete</button>
          )}
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem' }}>Project Name</label>
            <input
              type="text"
              value={project.name}
              onChange={e => updateProject(project.id, { name: e.target.value })}
              placeholder="Project name"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem' }}>Description</label>
            <textarea
              value={project.description}
              onChange={e => updateProject(project.id, { description: e.target.value })}
              placeholder="Brief description"
              rows={3}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.875rem' }}>Link (optional)</label>
            <input
              type="url"
              value={project.link || ''}
              onChange={e => updateProject(project.id, { link: e.target.value })}
              placeholder="https://example.com"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
