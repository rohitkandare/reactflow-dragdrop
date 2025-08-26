import React, { Suspense, useCallback, useMemo, useState } from 'react';
import {
    addEdge,
    Background,
    Controls,
    useEdgesState,
    useNodesState,
    ReactFlow
} from '@xyflow/react';
import './App.css';
import AddToolsModal from './components/AddToolsModal';
import AgentConfiguration from './components/AgentConfiguration';
import AssetLibrary from './components/AssetLibrary';
import './components/NodeStyles.css';
import ToolConfiguration from './components/ToolConfiguration';
import '@xyflow/react/dist/style.css';

import { createInitialEdges, createInitialNodes, nodeTypes } from './data/workflowData';

// Lazy load components for better performance
const LazyWorkflowTypeSelector = React.lazy(() => import('./components/WorkflowTypeSelector'));

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(createInitialEdges());
  const [activeTab, setActiveTab] = useState('agents');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [showWorkflowSelector, setShowWorkflowSelector] = useState(true);
  const [selectedWorkflowType, setSelectedWorkflowType] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [rfInstance, setRfInstance] = useState(null);
  const [isAddToolsOpen, setIsAddToolsOpen] = useState(false);
  const [targetAgentId, setTargetAgentId] = useState(null);

  // Simple auto layout for hierarchical workflows
  const layoutHierarchical = useCallback((nodesToLayout) => {
    const pane = document.querySelector('.react-flow');
    const paneWidth = pane ? pane.clientWidth : 1200;
    const centerX = paneWidth / 2;
    const verticalSpacing = 120;
    const horizontalSpacing = 300;

    const updated = nodesToLayout.map((n) => ({ ...n }));

    // Start node - centered at top
    const start = updated.find((n) => n.id === 'start');
    if (start) start.position = { x: centerX - 40, y: 50 };

    // Master agent - centered below start
    const master = updated.find((n) => n.id === 'master-agent');
    if (master) master.position = { x: centerX - 140, y: 50 + verticalSpacing };

    // Child agents (type === 'agent') - evenly spaced in a row
    const childAgents = updated.filter((n) => n.type === 'agent');
    childAgents.sort((a, b) => a.id.localeCompare(b.id));
    childAgents.forEach((agent, idx) => {
      const totalWidth = (childAgents.length - 1) * horizontalSpacing;
      const startX = centerX - totalWidth / 2;
      agent.position = { 
        x: startX + idx * horizontalSpacing, 
        y: 50 + verticalSpacing * 2 
      };
    });

    // End node - centered at bottom
    const end = updated.find((n) => n.id === 'end');
    if (end) end.position = { x: centerX - 40, y: 50 + verticalSpacing * 3 };

    return updated;
  }, []);

  const onConnect = (params) => {
    const newEdge = {
      ...params,
      markerEnd: {
        type: 'arrowclosed',
        width: 20,
        height: 20,
        color: '#9ca3af',
      },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  };

  // Select an edge when it is clicked
  const onEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setSelectedEdge(edge);
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const pane = document.querySelector('.react-flow__pane');
    if (pane) {
      pane.classList.add('drag-over');
    }
  }, []);

  const onDragLeave = useCallback((event) => {
    const pane = document.querySelector('.react-flow__pane');
    if (pane) {
      pane.classList.remove('drag-over');
    }
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const pane = document.querySelector('.react-flow__pane');
      if (pane) {
        pane.classList.remove('drag-over');
      }

      const reactFlowBounds = document.querySelector('.react-flow').getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const name = event.dataTransfer.getData('application/reactflow-name');
      const description = event.dataTransfer.getData('application/reactflow-description');

      // Only create nodes for agent drops on the canvas. Tools should be handled by agent nodes.
      if (typeof type === 'undefined' || !type || type !== 'agent') {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type: type === 'agent' ? 'agent' : 'agent',
        position,
        data: { 
          name: name || 'New Agent',
          tools: [],
          isNew: true,
          description: description || 'A new agent'
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  // Function to add tool to a specific agent
  const addToolToAgent = useCallback((agentId, toolName, toolDescription) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === agentId) {
          const newTool = {
            id: `tool-${Date.now()}`,
            name: toolName,
            description: toolDescription,
            variables: [
              { name: 'env-163844_api', type: 'Confidential', value: '' },
              { name: 'env-147653_api', type: 'Confidential', value: '' }
            ]
          };
          return {
            ...node,
            data: {
              ...node.data,
              tools: [...(node.data.tools || []), newTool]
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Open Add Tools modal for a given agent id
  const openAddTools = useCallback((agentId) => {
    setTargetAgentId(agentId);
    setIsAddToolsOpen(true);
  }, []);

  // Add multiple tools selected in the modal
  const handleAddTools = useCallback((tools) => {
    if (!targetAgentId || !Array.isArray(tools)) {
      setIsAddToolsOpen(false);
      return;
    }
    setNodes((nds) => nds.map((node) => {
      if (node.id !== targetAgentId) return node;
      const existing = node.data.tools || [];
      const mapped = tools.map((t) => ({
        id: `${t.id}-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        name: t.name,
        description: t.description,
        variables: []
      }));
      return {
        ...node,
        data: {
          ...node.data,
          tools: [...existing, ...mapped]
        }
      };
    }));
    setIsAddToolsOpen(false);
    setTargetAgentId(null);
  }, [targetAgentId, setNodes]);

  // Function to update node data (for agent configuration)
  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData
            }
          };
        }
        return node;
      })
    );
    
    // Also update the selected node state to reflect changes
    setSelectedNode((prevNode) => {
      if (prevNode && prevNode.id === nodeId) {
        return {
          ...prevNode,
          data: {
            ...prevNode.data,
            ...newData
          }
        };
      }
      return prevNode;
    });
  }, [setNodes]);

  // Function to update tool data (for tool configuration)
  const updateToolData = useCallback((toolId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.data.tools) {
          const updatedTools = node.data.tools.map((tool) => {
            if (tool.id === toolId) {
              return { ...tool, ...newData };
            }
            return tool;
          });
          
          return {
            ...node,
            data: {
              ...node.data,
              tools: updatedTools
            }
          };
        }
        return node;
      })
    );
    
    // Also update the selected tool state
    setSelectedTool((prevTool) => {
      if (prevTool && prevTool.id === toolId) {
        return { ...prevTool, ...newData };
      }
      return prevTool;
    });
  }, [setNodes]);

  // Function to delete tool from agent
  const deleteTool = useCallback((toolId) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.data.tools) {
          const updatedTools = node.data.tools.filter((tool) => tool.id !== toolId);
          
          return {
            ...node,
            data: {
              ...node.data,
              tools: updatedTools
            }
          };
        }
        return node;
      })
    );
    
    // Clear selected tool if it was deleted
    setSelectedTool(null);
  }, [setNodes]);

  const deleteAgent = useCallback((agentId) => {
  setNodes((nds) => nds.filter((node) => node.id !== agentId));
  // Clear selected node if it was deleted
  setSelectedNode((prevNode) => (prevNode && prevNode.id === agentId ? null : prevNode));
}, [setNodes]);

  // Function to handle workflow type selection
  const handleWorkflowTypeSelect = useCallback((workflowType) => {
    setSelectedWorkflowType(workflowType);
    setShowWorkflowSelector(false);
    
    // Set default tab based on workflow type
    if (workflowType.id === 'single') {
      setActiveTab('tools');
    } else {
      setActiveTab('agents');
    }
    
    // Initialize workflow based on selected type
    if (workflowType.id === 'single') {
      // Create single agent workflow
      const singleAgentNode = {
        id: 'single-agent',
        type: 'agent',
        position: { x: 400, y: 200 },
        data: { 
          name: 'Single Agent',
          description: 'A single agent that handles all tasks',
          modelFamily: 'Anthropic',
          modelName: 'Claude 3 Sonnet',
          promptInstruction: '',
          tools: []
        },
      };
      setNodes([singleAgentNode]);
      setEdges([]);
    } else if (workflowType.id === 'sequential') {
      // Create sequential agent workflow
      const sequentialNodes = [
        {
          id: 'start',
          type: 'startEnd',
          position: { x: 400, y: 50 },
          data: { label: '_start_' },
        },
        {
          id: 'agent-1',
          type: 'agent',
          position: { x: 200, y: 200 },
          data: { 
            name: 'First Agent',
            description: 'First agent in sequence',
            modelFamily: 'Anthropic',
            modelName: 'Claude 3 Sonnet',
            promptInstruction: '',
            tools: []
          },
        },
        {
          id: 'agent-2',
          type: 'agent',
          position: { x: 500, y: 200 },
          data: { 
            name: 'Second Agent',
            description: 'Second agent in sequence',
            modelFamily: 'Anthropic',
            modelName: 'Claude 3 Sonnet',
            promptInstruction: '',
            tools: []
          },
        },
        {
          id: 'agent-3',
          type: 'agent',
          position: { x: 800, y: 200 },
          data: { 
            name: 'Third Agent',
            description: 'Third agent in sequence',
            modelFamily: 'Anthropic',
            modelName: 'Claude 3 Sonnet',
            promptInstruction: '',
            tools: []
          },
        },
        {
          id: 'end',
          type: 'startEnd',
          position: { x: 500, y: 350 },
          data: { label: '_end_' },
        }
      ];
      
      const sequentialEdges = [
        {
          id: 'start-agent1',
          source: 'start',
          target: 'agent-1',
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
          id: 'agent1-agent2',
          source: 'agent-1',
          target: 'agent-2',
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
          id: 'agent2-agent3',
          source: 'agent-2',
          target: 'agent-3',
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
          id: 'agent3-end',
          source: 'agent-3',
          target: 'end',
          sourceHandle: 'source',
          targetHandle: 'target',
          type: 'smoothstep',
          markerEnd: {
            type: 'arrowclosed',
            width: 20,
            height: 20,
            color: '#9ca3af',
          },
        }
      ];
      
      setNodes(sequentialNodes);
      setEdges(sequentialEdges);
    } else if (workflowType.id === 'hierarchical') {
      // Create hierarchical agent workflow with direct start-to-end connection
      let hierarchicalNodes = createInitialNodes();
      const hierarchicalEdges = createInitialEdges();
      
      // Ensure the direct start-to-end connection is properly styled
      const directEdge = hierarchicalEdges.find(edge => edge.id === 'start-end-direct');
      if (directEdge) {
        directEdge.style = { 
          strokeDasharray: '5,5',
          stroke: '#6b7280',
          strokeWidth: 2
        };
      }
      
      hierarchicalNodes = layoutHierarchical(hierarchicalNodes);
      setNodes(hierarchicalNodes);
      setEdges(hierarchicalEdges);

      // Fit view after layout
      setTimeout(() => {
        if (rfInstance) {
          rfInstance.fitView({ 
            padding: 0.1,
            minZoom: 0.5,
            maxZoom: 1.2
          });
        }
      }, 100);
    }
  }, [setNodes, setEdges]);

  // Function to close workflow selector
  const handleCloseWorkflowSelector = useCallback(() => {
    setShowWorkflowSelector(false);
  }, []);

  // Function to reset workflow and show selector again
  const handleResetWorkflow = useCallback(() => {
    setShowWorkflowSelector(true);
    setSelectedWorkflowType(null);
    setSelectedNode(null);
    setSelectedTool(null);
  }, []);

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setSelectedTool(null); // Clear tool selection when node is selected
    setSelectedEdge(null); // Clear edge selection when node is selected
  }, []);

  // Handle pane click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedTool(null);
    setSelectedEdge(null);
  }, []);

  // Function to handle tool selection from agent nodes
  const onToolSelect = useCallback((tool) => {
    console.log('Tool selected:', tool);
    setSelectedTool(tool);
    setSelectedNode(null); // Clear node selection when tool is selected
  }, []);

  // Handle keyboard events for edge deletion


  // Add global keyboard event listener
  React.useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.key === 'Delete' && selectedEdge) {
        setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
        setSelectedEdge(null);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [selectedEdge, setEdges]);

  // Memoize the custom node types to prevent React Flow warnings
  const customNodeTypes = useMemo(() => ({
    startEnd: nodeTypes.startEnd,
    masterAgent: nodeTypes.masterAgent,
    agent: (props) => React.createElement(nodeTypes.agent, { 
      ...props, 
      addToolToAgent, 
      onToolSelect,
      selectedToolId: selectedTool?.id,
      deleteTool,
      deleteAgent,
      openAddTools
    })
  }), [addToolToAgent, onToolSelect, selectedTool?.id, deleteTool, openAddTools]);

  // Capture React Flow instance on init, and fit view initially
  const handleInit = useCallback((instance) => {
    setRfInstance(instance);
    setTimeout(() => {
      instance.fitView({ 
        padding: 0.1,
        minZoom: 0.5,
        maxZoom: 1.2
      });
    }, 100);
  }, []);

  // Apply selection styling to edges
  const styledEdges = useMemo(() => {
    return edges.map(edge => ({
      ...edge,
      style: {
        ...edge.style,
        stroke: selectedEdge?.id === edge.id ? '#ef4444' : edge.style?.stroke || '#9ca3af',
        strokeWidth: selectedEdge?.id === edge.id ? 3 : edge.style?.strokeWidth || 2,
      },
      className: selectedEdge?.id === edge.id ? 'selected-edge' : ''
    }));
  }, [edges, selectedEdge]);

  return (
    <div  className="flex h-screen w-screen overflow-hidden">
      {showWorkflowSelector ? (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyWorkflowTypeSelector
            onWorkflowTypeSelect={handleWorkflowTypeSelect}
            onClose={handleCloseWorkflowSelector}
          />
        </Suspense>
      ) : (
        <>
          <AssetLibrary 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onResetWorkflow={handleResetWorkflow}
            selectedWorkflowType={selectedWorkflowType}
          />
          <div className="flex-1 h-screen bg-gray-100 relative">
            <ReactFlow
              nodes={nodes}
              edges={styledEdges}
              nodeTypes={customNodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onEdgeClick={onEdgeClick}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onInit={handleInit}
              snapToGrid
              snapGrid={[16, 16]}
              fitView
              fitViewOptions={{
                padding: 0.1,
                minZoom: 0.5,
                maxZoom: 1.2
              }}
              minZoom={0.3}
              maxZoom={1.5}
              attributionPosition="bottom-left"
            >
              <Background color="#aaa" gap={16} />
              <Controls />
            </ReactFlow>
          </div>
          <AddToolsModal
            isOpen={isAddToolsOpen}
            onClose={() => setIsAddToolsOpen(false)}
            onAdd={handleAddTools}
          />
          {selectedTool ? (
            <ToolConfiguration 
              selectedTool={selectedTool}
              updateToolData={updateToolData}
            />
          ) : (
            <AgentConfiguration 
              selectedNode={selectedNode}
              updateNodeData={updateNodeData}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
