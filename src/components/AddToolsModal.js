import { Search } from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';

const DEFAULT_TOOLS = [
  { id: 'billing-diagnostic', name: 'billing-diagnostic', description: 'Helps in organizing the data and clear actionable items depending...' },
  { id: 'getting-customer-profile-data', name: 'getting-customer-profile-data', description: 'Helps in organizing the data and clear actionable items depending...' },
  { id: 'weather-lookup', name: 'weather-lookup', description: 'Helps in organizing the data and clear actionable items depending...' },
  { id: 'ticket-classification', name: 'ticket-classification', description: 'Helps in organizing the data and clear actionable items depending...' },
  { id: 'fetch-search-results', name: 'fetch-search-results', description: 'Indicates the urgency of the ticket, allowing teams to address critical issues promptly.' },
  { id: 'gcs-connect-search', name: 'gcs-connect-search', description: 'Reflects the current state of the ticket, such as open, in progress, or resolved.' },
  { id: 'composer-metrics', name: 'composer-metrics', description: 'Reflects the current state of the ticket, such as open, in progress, or resolved.' },
];

const AddToolsModal = ({ isOpen, onClose, onAdd, preselected = [], tools = DEFAULT_TOOLS, totalToolsCount = 0 }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(() => new Set(preselected));
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const filtered = useMemo(() => {
    if (!query) return tools;
    const q = query.toLowerCase();
    return tools.filter(t => t.name.toLowerCase().includes(q));
  }, [query, tools]);

  useEffect(() => { setPage(1); }, [query, tools.length]);

  const totalPages = Math.max(1, Math.ceil((totalToolsCount || filtered.length) / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paged = filtered.slice(start, end);

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
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[2000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-[900px] max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-gray-900 text-white">
          <h3>Add Tools</h3>
          <button
            className="bg-transparent border-none text-white text-xl cursor-pointer"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search Tool Name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none outline-none flex-1 bg-transparent"
            />
          </div>
        </div>

        <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3 overflow-auto">
          {paged.map((tool) => {
            const active = selected.has(tool.id);
            return (
              <div
                key={tool.id}
                className="border border-gray-200 rounded-lg p-3 bg-white cursor-pointer"
                onClick={() => toggle(tool.id)}
              >
                <div className="font-semibold mb-1.5">{tool.name}</div>
                <div className="text-xs text-gray-500 h-8 overflow-hidden">{tool.description}</div>
                <div
                  className={`mt-2.5 w-11 h-6 rounded-full relative transition-colors duration-200 ${
                    active ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform duration-200 ease-in-out ${
                      active ? 'transform translate-x-5' : ''
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 pb-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">{`${start + 1}-${Math.min(end, totalToolsCount || filtered.length)} of ${totalToolsCount || filtered.length}`}</span>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >Prev</button>
            <span className="text-xs text-gray-600">Page {page} / {totalPages}</span>
            <button
              className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >Next</button>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 px-5 py-4 border-t border-gray-200">
          <button
            className="bg-gray-100 border border-gray-200 px-3.5 py-2 rounded-full cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-gray-900 text-white border-none px-3.5 py-2 rounded-full cursor-pointer"
            onClick={handleAdd}
          >
            Add to Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToolsModal;