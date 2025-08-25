import {
  ChevronRight,
  ChevronLeft,
  Grid,
  Search,
  User,
  Wrench
} from 'lucide-react';
import React, { useState } from 'react';
import './AssetLibrary.css';

const AssetLibrary = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, onResetWorkflow, selectedWorkflowType }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const agents = [
    {
      id: 1,
      name: "Customer Infobot",
      description: "Helps answering customer query about anything..",
      icon: "🤖"
    },
    {
      id: 2,
      name: "Promotion Copy Writer",
      description: "Helps in creating promotional content and copy..",
      icon: "✍️"
    },
    {
      id: 3,
      name: "Device offer Analysis",
      description: "Analyzes device offers and provides insights..",
      icon: "📊"
    },
    {
      id: 4,
      name: "ACSS Support Chatbot",
      description: "Provides automated customer support..",
      icon: "💬"
    },
    {
      id: 5,
      name: "Customer Data Retrival",
      description: "Retrieves and manages customer data..",
      icon: "📋"
    }
  ];

  const tools = [
    {
      id: 1,
      name: "bulk-doc-check",
      description: "Helps in organizing the data and clear actionable items depending...",
      icon: "🔧"
    },
    {
      id: 2,
      name: "data-analytics-tool",
      description: "Helps in organizing the data and clear actionable items depending...",
      icon: "📈"
    },
    {
      id: 3,
      name: "web-search-tool",
      description: "Helps in organizing the data and clear actionable items depending...",
      icon: "🌐"
    },
    {
      id: 4,
      name: "ticket-classification",
      description: "Helps in organizing the data and clear actionable items depending...",
      icon: "🎫"
    },
    {
      id: 5,
      name: "fetch-search-results",
      description: "Helps in organizing the data and clear actionable items depending...",
      icon: "🔍"
    },
    {
      id: 6,
      name: "gcs-connect-search",
      description: "Helps in organizing the data and clear actionable items depending...",
      icon: "☁️"
    },
    {
      id: 7,
      name: "composer-metrics",
      description: "Helps in organizing the data and clear actionable items depending...",
      icon: "📊"
    }
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
    <div className={`asset-library ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="asset-library-header" onClick={handleToggleCollapse}>
        <div className="header-main">
          <h2>Asset Library</h2>
          {selectedWorkflowType && !isCollapsed && (
            <div className="workflow-type-indicator">
              <span className="type-label">{selectedWorkflowType.title}</span>
            </div>
          )}
        </div>
        <div className="header-actions">
          {!isCollapsed && (
            <button 
              className="reset-workflow-btn"
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
            <ChevronLeft className="collapse-icon" />
          ) : (
            <ChevronRight className="collapse-icon" />
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="add-new-assets">
            <h3>Add New Assets</h3>
            <div className="asset-buttons">
              <button 
                className="asset-button agent-button"
                draggable
                onDragStart={(event) => onDragStartAgent(event, 'New Agent', 'A new agent')}
              >
                <User className="asset-icon" />
                <span>Agent</span>
                <Grid className="grid-icon" />
              </button>
              <button 
                className="asset-button tool-button"
                draggable
                onDragStart={(event) => onDragStartTool(event, 'New Tool', 'A new tool')}
              >
                <Wrench className="asset-icon" />
                <span>Tool</span>
                <Grid className="grid-icon" />
              </button>
            </div>
          </div>

          <div className="existing-assets">
            <h3>Choose from Existing Assets</h3>
            
            <div className="tabs">
              {selectedWorkflowType?.id !== 'single' && (
                <button 
                  className={`tab ${activeTab === 'agents' ? 'active' : ''}`}
                  onClick={() => setActiveTab('agents')}
                >
                  My Agents
                </button>
              )}
              <button 
                className={`tab ${activeTab === 'tools' ? 'active' : ''}`}
                onClick={() => setActiveTab('tools')}
              >
                Tools
              </button>
            </div>

            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder={activeTab === 'agents' ? 'Search agent' : 'Search tools'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="assets-list">
              {activeTab === 'agents' ? (
                filteredAgents.map(agent => (
                  <div 
                    key={agent.id} 
                    className="asset-item"
                    draggable
                    onDragStart={(event) => onDragStartAgent(event, agent.name, agent.description)}
                  >
                    <div className="asset-icon-container">
                      <span className="asset-emoji">{agent.icon}</span>
                    </div>
                    <div className="asset-content">
                      <h4>{agent.name}</h4>
                      <p>{agent.description}</p>
                    </div>
                    <Grid className="drag-icon" />
                  </div>
                ))
              ) : (
                filteredTools.map(tool => (
                  <div 
                    key={tool.id} 
                    className="asset-item tool-item"
                    draggable
                    onDragStart={(event) => onDragStartTool(event, tool.name, tool.description)}
                  >
                    <div className="asset-icon-container">
                      <span className="asset-emoji">{tool.icon}</span>
                    </div>
                    <div className="asset-content">
                      <h4>{tool.name}</h4>
                      <p>{tool.description}</p>
                    </div>
                    <Grid className="drag-icon" />
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
