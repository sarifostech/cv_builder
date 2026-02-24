'use client';

import { useState } from 'react';

interface AITipsPanelProps {
  industry: string;
  section: string;
  onSelect: (suggestion: string) => void;
}

const SUGGESTIONS: Record<string, Record<string, string[]>> = {
  action_verbs: {
    experience: [
      'Spearheaded', 'Orchestrated', 'Championed', 'Pioneered', 'Revolutionized',
      'Transformed', 'Streamlined', 'Modernized', 'Automated', 'Integrated'
    ],
    summary: [
      'Results-driven', 'Detail-oriented', 'Innovative', 'Collaborative', 'Strategic',
      'Proactive', 'Analytical', 'Creative', 'Dynamic', 'Motivated'
    ],
    skills: [
      'Mastered', 'Proficient in', 'Skilled at', 'Experienced with', 'Competent in',
      'Fluent in', 'Certified in', 'Trained in', 'Specialized in', 'Adept at'
    ],
    projects: [
      'Developed', 'Built', 'Created', 'Designed', 'Engineered', 'Launched',
      'Implemented', 'Optimized', 'Enhanced', 'Modernized'
    ]
  },
  keywords: {
    experience: [
      'Project management', 'Cross-functional collaboration', 'Stakeholder engagement',
      'Process improvement', 'Budget management', 'Team leadership', 'Client relations',
      'Quality assurance', 'Risk management', 'Strategic planning'
    ],
    summary: [
      'Results-oriented', 'Detail-focused', 'Innovative thinker', 'Collaborative team player',
      'Strategic planner', 'Proactive problem solver', 'Analytical mindset', 'Creative approach',
      'Dynamic professional', 'Motivated achiever'
    ],
    skills: [
      'Technical proficiency', 'Software expertise', 'Programming languages', 'Design tools',
      'Analytical tools', 'Communication platforms', 'Project management software',
      'Data visualization', 'Cloud computing', 'Cybersecurity'
    ],
    projects: [
      'Full-stack development', 'Mobile application design', 'Web development', 'API integration',
      'Database management', 'UI/UX design', 'Cloud deployment', 'Agile methodology',
      'DevOps practices', 'Quality assurance'
    ]
  },
  metrics: {
    experience: [
      'Increased revenue by 25%', 'Reduced costs by 15%', 'Improved efficiency by 30%',
      'Saved 100+ hours annually', 'Managed $500K budget', 'Led team of 15+ members',
      'Achieved 95% customer satisfaction', 'Increased sales by 40%', 'Reduced processing time by 50%',
      'Implemented system serving 10K+ users'
    ],
    projects: [
      'Delivered project 2 weeks ahead of schedule', 'Achieved 99.9% uptime',
      'Reduced page load time by 60%', 'Increased user engagement by 35%',
      'Processed 1M+ transactions', 'Supported 50K+ concurrent users',
      'Reduced error rate by 80%', 'Improved conversion rate by 25%',
      'Generated $1M+ in revenue', 'Saved $200K in operational costs'
    ]
  }
};

export default function AITipsPanel({ industry, section, onSelect }: AITipsPanelProps) {
  const [activeTab, setActiveTab] = useState<'action_verbs' | 'keywords' | 'metrics'>('action_verbs');
  const [isOpen, setIsOpen] = useState(false);

  const getSuggestions = () => {
    if (!industry || !section) return [];
    const sectionKey = section.toLowerCase();
    const baseAction = SUGGESTIONS.action_verbs[sectionKey] || [];
    const baseKeywords = SUGGESTIONS.keywords[sectionKey] || [];
    const baseMetrics = SUGGESTIONS.metrics[sectionKey] || [];
    const all = [...baseAction, ...baseKeywords, ...baseMetrics];
    return Array.from(new Set(all)).slice(0, 10);
  };

  const handleInsert = (suggestion: string) => {
    onSelect(suggestion);
    setIsOpen(false);
  };

  const suggestions = getSuggestions();

  return (
    <div className={`fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white rounded-l-lg shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">AI Writing Tips</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab('action_verbs')}
            className={`px-3 py-1 rounded-full text-sm ${activeTab === 'action_verbs' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Verbs
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-3 py-1 rounded-full text-sm ${activeTab === 'keywords' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Keywords
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1 rounded-full text-sm ${activeTab === 'metrics' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Metrics
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {suggestions.length === 0 ? (
            <p className="text-gray-500 text-sm">No suggestions available. Select an industry and section.</p>
          ) : (
            <ul className="space-y-2">
              {suggestions.map((s, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleInsert(s)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm text-gray-800 border border-gray-200"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
