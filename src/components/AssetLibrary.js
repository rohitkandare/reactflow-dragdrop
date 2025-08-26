import {
  ChevronRight,
  ChevronLeft,
  Grid,
  Search,
  User,
  Wrench
} from 'lucide-react';
import React, { useState } from 'react';

const AssetLibrary = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, onResetWorkflow, selectedWorkflowType }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const agents = [
    { id: 1, name: "Customer Infobot", description: "Helps answering customer query about anything..", icon: "🤖" },
    { id: 2, name: "Promotion Copy Writer", description: "Helps in creating promotional content and copy..", icon: "✍️" },
    { id: 3, name: "Device offer Analysis", description: "Analyzes device offers and provides insights..", icon: "📊" },
    { id: 4, name: "ACSS Support Chatbot", description: "Provides automated customer support..", icon: "💬" },
    { id: 5, name: "Customer Data Retrival", description: "Retrieves and manages customer data..", icon: "📋" }
  ];

  const tools = [
    { id: 1, name: "bulk-doc-check", description: "Helps in organizing the data and clear actionable items depending...", icon: "🔧" },
    { id: 2, name: "data-analytics-tool", description: "Helps in organizing the data and clear actionable items depending...", icon: "📈" },
    { id: 3, name: "web-search-tool", description: "Helps in organizing the data and clear actionable items depending...", icon: "🌐" },
    { id: 4, name: "ticket-classification", description: "Helps in organizing the data and clear actionable items depending...", icon: "🎫" },
    { id: 5, name: "fetch-search-results", description: "Helps in organizing the data and clear actionable items depending...", icon: "🔍" },
    { id: 6, name: "gcs-connect-search", description: "Helps in organizing the data and clear actionable items depending...", icon: "☁️" },
    { id: 7, name: "composer-metrics", description: "Helps in organizing the data and clear actionable items depending...", icon: "📊" }
  ];

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onDragStart = (event, nodeType, name, description) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-name', name);
    event.dataTransfer.setData('application/reactflow-description', description);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragStartAgent = (event, name, description) => {
    onDragStart(event, 'agent', name, description);
  };

  const onDragStartTool = (event, name, description) => {
    onDragStart(event, 'tool', name, description);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden h-screen ${isCollapsed ? 'w-[60px]' : 'w-[320px]'}`}>
      <div
        className={`flex items-center justify-between border-b border-gray-200 ${isCollapsed ? 'px-2.5 py-5 justify-center' : 'px-5 py-5'}`}
        onClick={handleToggleCollapse}
      >
        <div className="flex flex-col gap-1">
          <h2 className={`text-lg font-semibold text-gray-900 m-0 ${isCollapsed ? 'hidden' : ''}`}>Asset Library</h2>
          {selectedWorkflowType && !isCollapsed && (
            <div className="flex items-center gap-1.5">
              <span className="bg-blue-500 text-white px-2 py-0.5 rounded-xl text-[11px] font-medium uppercase tracking-wide">{selectedWorkflowType.title}</span>
            </div>
          )}
        </div>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && (
            <button
              className="bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:border-gray-400 hover:text-gray-900"
              onClick={(e) => {
                e.stopPropagation();
                onResetWorkflow();
              }}
              title="Reset workflow and choose new type"
            >
              Reset Workflow
            </button>
          )}
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4 text-red-500 cursor-pointer" />
          ) : (
            <ChevronRight className="w-4 h-4 text-red-500 cursor-pointer" />
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Add New Assets</h3>
            <div className="flex flex-col gap-3">
              <button
                className="flex items-center justify-between px-4 py-3 border border-blue-500 rounded-lg bg-blue-50 text-blue-900 cursor-pointer transition-all duration-200 text-sm font-medium hover:border-blue-400 hover:shadow"
                draggable
                onDragStart={(event) => onDragStartAgent(event, 'New Agent', 'A new agent')}
              >
                <User className="w-4 h-4 text-blue-500" />
                <span>Agent</span>
                <Grid className="w-3.5 h-3.5 text-gray-500" />
              </button>
              <button
                className="flex items-center justify-between px-4 py-3 border border-yellow-500 rounded-lg bg-yellow-100 text-yellow-900 cursor-pointer transition-all duration-200 text-sm font-medium hover:border-yellow-400 hover:shadow"
                draggable
                onDragStart={(event) => onDragStartTool(event, 'New Tool', 'A new tool')}
              >
                <Wrench className="w-4 h-4 text-yellow-500" />
                <span>Tool</span>
                <Grid className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-5 flex flex-col overflow-hidden">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Choose from Existing Assets</h3>
            <div className="flex border-b border-gray-200 mb-4">
              {selectedWorkflowType?.id !== 'single' && (
                <button
                  className={`flex-1 px-4 py-2 bg-none border-none text-sm font-medium text-gray-500 cursor-pointer border-b-2 border-transparent transition-all duration-200 ${activeTab === 'agents' ? 'text-red-500 border-b-red-500' : ''}`}
                  onClick={() => setActiveTab('agents')}
                >
                  My Agents
                </button>
              )}
              <button
                className={`flex-1 px-4 py-2 bg-none border-none text-sm font-medium text-gray-500 cursor-pointer border-b-2 border-transparent transition-all duration-200 ${activeTab === 'tools' ? 'text-red-500 border-b-red-500' : ''}`}
                onClick={() => setActiveTab('tools')}
              >
                Tools
              </button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'agents' ? 'Search agent' : 'Search tools'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-9 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
              />
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {activeTab === 'agents' ? (
                filteredAgents.map(agent => (
                  <div
                    key={agent.id}
                    className="flex items-start px-3 py-3 border border-gray-200 rounded-lg bg-white cursor-pointer transition-all duration-200 gap-3 hover:border-blue-400 hover:shadow active:cursor-grabbing active:scale-98"
                    draggable
                    onDragStart={(event) => onDragStartAgent(event, agent.name, agent.description)}
                  >
                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{agent.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{agent.name}</h4>
                      <p className="text-xs text-gray-500 m-0 leading-tight line-clamp-2">{agent.description}</p>
                    </div>
                    <Grid className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  </div>
                ))
              ) : (
                filteredTools.map(tool => (
                  <div
                    key={tool.id}
                    className="flex items-start px-3 py-3 border border-yellow-500 rounded-lg bg-yellow-100 cursor-pointer transition-all duration-200 gap-3 hover:border-yellow-400 hover:shadow active:cursor-grabbing active:scale-98"
                    draggable
                    onDragStart={(event) => onDragStartTool(event, tool.name, tool.description)}
                  >
                    <div className="w-8 h-8 rounded bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{tool.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{tool.name}</h4>
                      <p className="text-xs text-gray-500 m-0 leading-tight line-clamp-2">{tool.description}</p>
                    </div>
                    <Grid className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AssetLibrary;