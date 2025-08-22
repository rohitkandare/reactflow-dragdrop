import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    useEdgesState,
    useNodesState
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import './App.css';
import AgentConfiguration from './components/AgentConfiguration';
import AssetLibrary from './components/AssetLibrary';
import './components/NodeStyles.css';
import ToolConfiguration from './components/ToolConfiguration';
import { createInitialEdges, createInitialNodes, nodeTypes } from './data/workflowData';

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(createInitialEdges());
  const [activeTab, setActiveTab] = useState('agents');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  const onConnect = (params) => {
    setEdges((eds) => addEdge(params, eds));
  };

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

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setSelectedTool(null); // Clear tool selection when node is selected
  }, []);

  // Handle pane click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedTool(null);
  }, []);

  // Function to handle tool selection from agent nodes
  const onToolSelect = useCallback((tool) => {
    console.log('Tool selected:', tool);
    setSelectedTool(tool);
    setSelectedNode(null); // Clear node selection when tool is selected
  }, []);

  // Memoize the custom node types to prevent React Flow warnings
  const customNodeTypes = useMemo(() => ({
    startEnd: nodeTypes.startEnd,
    masterAgent: nodeTypes.masterAgent,
    agent: (props) => React.createElement(nodeTypes.agent, { 
      ...props, 
      addToolToAgent, 
      onToolSelect,
      selectedToolId: selectedTool?.id 
    })
  }), [addToolToAgent, onToolSelect, selectedTool?.id]);

  return (
    <div className="app">
      <AssetLibrary 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="workflow-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={customNodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
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
    </div>
  );
}

export default App;
