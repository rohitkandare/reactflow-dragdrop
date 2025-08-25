import { Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import './AddToolsModal.css';

const DEFAULT_TOOLS = [
  { id: 'billing-diagnostic', name: 'billing-diagnostic', description: 'Helps in organizing the data and clear actionable items depending...' },
  { id: 'getting-customer-profile-data', name: 'getting-customer-profile-data', description: 'Helps in organizing the data and clear actionable items depending...' },
  { id: 'weather-lookup', name: 'weather-lookup', description: 'Helps in organizing the data and clear actionable items depending...' },
  { id: 'ticket-classification', name: 'ticket-classification', description: 'Helps in organizing the data and clear actionable items depending...' },
  { id: 'fetch-search-results', name: 'fetch-search-results', description: 'Indicates the urgency of the ticket, allowing teams to address critical issues promptly.' },
  { id: 'gcs-connect-search', name: 'gcs-connect-search', description: 'Reflects the current state of the ticket, such as open, in progress, or resolved.' },
  { id: 'composer-metrics', name: 'composer-metrics', description: 'Reflects the current state of the ticket, such as open, in progress, or resolved.' },
];

const AddToolsModal = ({ isOpen, onClose, onAdd, preselected = [], tools = DEFAULT_TOOLS }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(() => new Set(preselected));

  const filtered = useMemo(() => {
    if (!query) return tools;
    const q = query.toLowerCase();
    return tools.filter(t => t.name.toLowerCase().includes(q));
  }, [query, tools]);

  if (!isOpen) return null;

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    const ids = Array.from(selected);
    const selectedTools = tools.filter(t => ids.includes(t.id));
    onAdd(selectedTools);
  };

  return (
    <div className="addtools-overlay" onClick={onClose}>
      <div className="addtools-modal" onClick={(e) => e.stopPropagation()}>
        <div className="addtools-header">
          <h3>Add Tools</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="search-row">
          <div className="search-input">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search Tool Name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="tools-grid">
          {filtered.map((tool) => {
            const active = selected.has(tool.id);
            return (
              <div key={tool.id} className="tool-card" onClick={() => toggle(tool.id)}>
                <div className="tool-title">{tool.name}</div>
                <div className="tool-desc">{tool.description}</div>
                <div className={`toggle ${active ? 'on' : ''}`}> 
                  <div className="knob" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="footer">
          <button className="secondary" onClick={onClose}>Cancel</button>
          <button className="primary" onClick={handleAdd}>Add to Agent</button>
        </div>
      </div>
    </div>
  );
};

export default AddToolsModal;



