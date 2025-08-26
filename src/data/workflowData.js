import { ChevronDown, ChevronUp, MoreVertical, Play, Plus, Trash2, User, Wrench } from 'lucide-react';
import React from 'react';
import { Handle, Position } from '@xyflow/react';

// Custom Start/End Node Component
const StartEndNode = ({ data }) => (
  <div className="start-end-node">
    <Handle type="source" position={Position.Bottom} id="source" />
    <Handle type="target" position={Position.Top} id="target" />
    {data.label}

  </div>
);

// Custom Agent Node Component
const AgentNode = ({ data, id, addToolToAgent, onToolSelect, selectedToolId, deleteTool,deleteAgent, openAddTools }) => {
  const [toolsExpanded, setToolsExpanded] = React.useState(true);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [toolMenuStates, setToolMenuStates] = React.useState({});
  
  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu) {
        setShowMenu(false);
      }
      if (Object.keys(toolMenuStates).some(key => toolMenuStates[key])) {
        closeAllToolMenus();
      }
    };

    if (showMenu || Object.keys(toolMenuStates).some(key => toolMenuStates[key])) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showMenu, toolMenuStates]);
  
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    event.currentTarget.classList.add('drag-over');
  };

  const onDragLeave = (event) => {
    event.currentTarget.classList.remove('drag-over');
  };

  const onDrop = (event) => {
    event.preventDefault();
    // Prevent canvas from handling this drop
    event.stopPropagation();
    event.currentTarget.classList.remove('drag-over');
    
    const toolName = event.dataTransfer.getData('application/reactflow-name');
    const toolDescription = event.dataTransfer.getData('application/reactflow-description');
    const toolType = event.dataTransfer.getData('application/reactflow');
    
    if (toolName && toolType === 'tool' && addToolToAgent) {
      addToolToAgent(id, toolName, toolDescription);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleToolClick = (tool) => {
    console.log('Tool clicked:', tool);
    if (onToolSelect) {
      onToolSelect(tool);
    }
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = (event , id) => {
    event.stopPropagation();
    console.log('Delete agent:', id);
    setShowMenu(false);
    // TODO: Implement delete functionality
    if (deleteAgent) {
      deleteAgent(id);
    }
  };

  const handleTest = (event) => {
    event.stopPropagation();
    console.log('Test agent:', id);
    setShowMenu(false);
    // TODO: Implement test functionality
  };

  const handleDeleteTool = (event, toolId) => {
    event.stopPropagation();
    if (deleteTool) {
      deleteTool(toolId);
    }
  };

  const handleToolMenuClick = (event, toolId) => {
    event.stopPropagation();
    setToolMenuStates(prev => ({
      ...prev,
      [toolId]: !prev[toolId]
    }));
  };

  const closeAllToolMenus = () => {
    setToolMenuStates({});
  };

  const getToolStatus = (tool) => {
    if (!tool.variables || tool.variables.length === 0) return 'ready';
    
    const hasEmptyValues = tool.variables.some(variable => !variable.value);
    return hasEmptyValues ? 'warning' : 'ready';
  };

  const getWarningCount = (tool) => {
    if (!tool.variables || tool.variables.length === 0) return 0;
    return tool.variables.filter(variable => !variable.value).length;
  };
  
  return (
    <div className="agent-node">
      <Handle type="target" position={Position.Top} id="target" />
      
      <div className="agent-header">
        <div className="agent-info">
          <User className="agent-icon" />
          <div className="agent-details">
            <div className="agent-title">
              <span className="agent-label">Agent</span>
              <span className="agent-status configured">Configured</span>
            </div>
            <div className="agent-name">{data.name}</div>
            <div className="agent-model">
              <span className="model-icon">✨</span>
              {data.modelFamily} {data.modelName}
            </div>
          </div>
        </div>
        <div className="menu-container">
          <MoreVertical 
            className="menu-icon" 
            onClick={handleMenuClick}
          />
          {showMenu && (
            <div className="dropdown-menu">
              <div className="menu-item" onClick={(e)=>handleDelete(e, id)}>
                <Trash2 size={14} />
                <span>Delete</span>
              </div>
              <div className="menu-item" onClick={handleTest}>
                <Play size={14} />
                <span>Test</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {data.tools && data.tools.length > 0 && (
        <div className="tools-section">
          <div 
            className="tools-header"
            onClick={() => setToolsExpanded(!toolsExpanded)}
          >
            <span>Tools ({data.tools.length})</span>
            {toolsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          
          {toolsExpanded && (
            <div className="tools-list">
              {data.tools.map((tool, index) => {
                const status = getToolStatus(tool);
                const warningCount = getWarningCount(tool);
                const isSelected = selectedToolId === tool.id;
                
                return (
                  <div 
                    key={tool.id || index} 
                    className={`tool-item ${status === 'warning' ? 'warning' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToolClick(tool);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Wrench className="tool-icon" />
                    <div className="tool-info">
                      <span className="tool-label">Tool</span>
                      <span className={`tool-status ${status}`}>
                        {status === 'warning' ? `${warningCount} Key needed` : 'Ready'}
                      </span>
                    </div>
                    <div className="tool-name">{tool.name}</div>
                    <div className="tool-actions">
                      <div className="tool-menu-container">
                        <MoreVertical 
                          className="tool-menu" 
                          onClick={(e) => handleToolMenuClick(e, tool.id)}
                        />
                        {toolMenuStates[tool.id] && (
                          <div className="tool-dropdown-menu">
                            <div className="menu-item" onClick={(e) => handleDeleteTool(e, tool.id)}>
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div 
        className={`drop-zone ${showSuccess ? 'success' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{ cursor: 'default' }}
      >
        <Plus className="drop-icon" />
        <span>
          {showSuccess ? 'Tool added successfully!' : (
            <>
              Drop tool here or <span 
                className="add-tool-link"
                onClick={(e) => {
                  e.stopPropagation();
                  if (openAddTools) openAddTools(id);
                }}
              >Add tool</span>
            </>
          )}
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} id="source" />
    </div>
  );
};

// Custom Master Agent Node Component
const MasterAgentNode = ({ data, id }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  
  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showMenu]);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    console.log('Delete master agent:', id);
    setShowMenu(false);
    // TODO: Implement delete functionality
  };

  const handleTest = (event) => {
    event.stopPropagation();
    console.log('Test master agent:', id);
    setShowMenu(false);
    // TODO: Implement test functionality
  };

  return (
    <div className="master-agent-node">
      <Handle type="target" position={Position.Top} id="target" />
      
      <div className="agent-header">
        <div className="agent-info">
          <User className="agent-icon" />
          <div className="agent-details">
            <div className="agent-title">
              <span className="agent-label">Agent</span>
              <span className="agent-status configured">Configured</span>
            </div>
            <div className="agent-name">{data.name}</div>
            <div className="agent-model">
              <span className="model-icon">✨</span>
              {data.modelFamily} {data.modelName}
            </div>
          </div>
        </div>
        <div className="menu-container">
          <MoreVertical 
            className="menu-icon" 
            onClick={handleMenuClick}
          />
          {showMenu && (
            <div className="dropdown-menu">
              <div className="menu-item" onClick={handleDelete}>
                <Trash2 size={14} />
                <span>Delete</span>
              </div>
              <div className="menu-item" onClick={handleTest}>
                <Play size={14} />
                <span>Test</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} id="source" />
    </div>
  );
};

export const createInitialNodes = () => [
  {
    id: 'start',
    type: 'startEnd',
    position: { x: 400, y: 50 },
    data: { label: '_start_' },
  },
  {
    id: 'master-agent',
    type: 'masterAgent',
    position: { x: 400, y: 150 },
    data: { 
      name: 'Supervisor-agent',
      description: 'An agent helps you understand today\'s weather worldwide.',
      modelFamily: 'Anthropic',
      modelName: 'Claude 3 Sonnet',
      promptInstruction: '',
      tools: []
    },
  },
  {
    id: 'weather-agent',
    type: 'agent',
    position: { x: 200, y: 350 },
    data: { 
      name: 'Weather Report Agent',
      description: 'An agent that provides weather information and reports.',
      modelFamily: 'Anthropic',
      modelName: 'Claude 3 Sonnet',
      promptInstruction: '',
      tools: [
        { 
          id: 'web-search-tool-1',
          name: 'web-search-tool',
          description: 'Web search functionality',
          variables: [
            { name: 'env-163844_api', type: 'Confidential', value: '' },
            { name: 'env-147653_api', type: 'Confidential', value: '' }
          ]
        },
        { 
          id: 'billing-diagnostic-1',
          name: 'billing-diagnostic',
          description: 'Billing diagnostic tool',
          variables: []
        }
      ]
    },
  },
  {
    id: 'chatbot-agent',
    type: 'agent',
    position: { x: 400, y: 350 },
    data: { 
      name: 'chatbot agent',
      description: 'A conversational agent for customer support.',
      modelFamily: 'Anthropic',
      modelName: 'Claude 3 Sonnet',
      promptInstruction: '',
      tools: [
        { 
          id: 'data-integration-1',
          name: 'data-integration',
          description: 'Data integration tool',
          variables: []
        },
        { 
          id: 'getting-customer-profile-data-1',
          name: 'getting-customer-profile-data',
          description: 'Customer profile data tool',
          variables: []
        }
      ]
    },
  },
  {
    id: 'diagnostic-agent',
    type: 'agent',
    position: { x: 600, y: 350 },
    data: { 
      name: 'diagnostic agent',
      description: 'An agent for system diagnostics and troubleshooting.',
      modelFamily: 'Anthropic',
      modelName: 'Claude 3 Sonnet',
      promptInstruction: '',
      tools: [
        { 
          id: 'billing-diagnostic-2',
          name: 'billing-diagnostic',
          description: 'Billing diagnostic tool',
          variables: []
        },
        { 
          id: 'getting-customer-profile-data-2',
          name: 'getting-customer-profile-data',
          description: 'Customer profile data tool',
          variables: []
        }
      ]
    },
  },
  {
    id: 'end',
    type: 'startEnd',
    position: { x: 400, y: 550 },
    data: { label: '_end_' },
  },
];

export const createInitialEdges = () => [
  {
    id: 'start-master',
    source: 'start',
    target: 'master-agent',
    sourceHandle: 'source',
    targetHandle: 'target',
    type: 'smoothstep',
    markerEnd: {
      type: 'arrowclosed',
      width: 20,
      height: 20,
      color: '#9ca3af',
    },
  },
  {
    id: 'master-weather',
    source: 'master-agent',
    target: 'weather-agent',
    sourceHandle: 'source',
    targetHandle: 'target',
    type: 'smoothstep',
    markerEnd: {
      type: 'arrowclosed',
      width: 20,
      height: 20,
      color: '#9ca3af',
    },
  },
  {
    id: 'master-chatbot',
    source: 'master-agent',
    target: 'chatbot-agent',
    sourceHandle: 'source',
    targetHandle: 'target',
    type: 'smoothstep',
    markerEnd: {
      type: 'arrowclosed',
      width: 20,
      height: 20,
      color: '#9ca3af',
    },
  },
  {
    id: 'master-diagnostic',
    source: 'master-agent',
    target: 'diagnostic-agent',
    sourceHandle: 'source',
    targetHandle: 'target',
    type: 'smoothstep',
    markerEnd: {
      type: 'arrowclosed',
      width: 20,
      height: 20,
      color: '#9ca3af',
    },
  },
  {
    id: 'start-end-direct',
    source: 'start',
    target: 'end',
    sourceHandle: 'source',
    targetHandle: 'target',
    type: 'smoothstep',
    style: { strokeDasharray: '5,5' }, // Dashed line to distinguish from agent paths
    markerEnd: {
      type: 'arrowclosed',
      width: 20,
      height: 20,
      color: '#6b7280',
    },
  },
];

export const nodeTypes = {
  startEnd: StartEndNode,
  agent: AgentNode,
  masterAgent: MasterAgentNode,
};
