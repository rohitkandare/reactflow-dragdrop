import React, { useState, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react';
import './AgentConfiguration.css';

const AgentConfiguration = ({ selectedNode, updateNodeData }) => {
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [modelFamily, setModelFamily] = useState('Anthropic');
  const [modelName, setModelName] = useState('Claude 3 Sonnet');
  const [promptInstruction, setPromptInstruction] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setAgentName(selectedNode.data.name || '');
      setAgentDescription(selectedNode.data.description || '');
      setModelFamily(selectedNode.data.modelFamily || 'Anthropic');
      setModelName(selectedNode.data.modelName || 'Claude 3 Sonnet');
      setPromptInstruction(selectedNode.data.promptInstruction || '');
    } else {
      setAgentName('');
      setAgentDescription('');
      setModelFamily('Anthropic');
      setModelName('Claude 3 Sonnet');
      setPromptInstruction('');
    }
  }, [selectedNode]);

  const handleSave = useCallback(() => {
    if (selectedNode) {
      const updatedData = {
        name: agentName,
        description: agentDescription,
        modelFamily: modelFamily,
        modelName: modelName,
        promptInstruction: promptInstruction,
      };
      
      updateNodeData(selectedNode.id, updatedData);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  }, [selectedNode, updateNodeData, agentName, agentDescription, modelFamily, modelName, promptInstruction]);

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="agent-configuration">
      <div className="config-header">
        <h2>Agent Configuration</h2>
        <button 
          className={`save-button ${showSuccess ? 'success' : ''}`} 
          onClick={handleSave}
        >
          {showSuccess ? 'Saved!' : 'Save'}
        </button>
      </div>
      <div className="config-body">
        <div className="form-group">
          <label htmlFor="agentName">Agent Name</label>
          <input
            type="text"
            id="agentName"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="agentDescription">Agent Description</label>
          <textarea
            id="agentDescription"
            value={agentDescription}
            onChange={(e) => setAgentDescription(e.target.value)}
            rows="3"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="modelFamily">Model Family <Info size={14} className="info-icon" /></label>
          <select
            id="modelFamily"
            value={modelFamily}
            onChange={(e) => setModelFamily(e.target.value)}
          >
            <option value="Anthropic">Anthropic</option>
            <option value="OpenAI">OpenAI</option>
            <option value="Google">Google</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="modelName">Model Name <Info size={14} className="info-icon" /></label>
          <select
            id="modelName"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          >
            <option value="Claude 3 Sonnet">Claude 3 Sonnet</option>
            <option value="Claude 3 Opus">Claude 3 Opus</option>
            <option value="GPT-4">GPT-4</option>
            <option value="Gemini Pro">Gemini Pro</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="promptInstruction">Prompt Instruction <Info size={14} className="info-icon" /></label>
          <select
            id="promptInstruction"
            value={promptInstruction}
            onChange={(e) => setPromptInstruction(e.target.value)}
          >
            <option value="">Select a prompt template</option>
            <option value="template1">Template 1</option>
            <option value="template2">Template 2</option>
          </select>
        </div>
        <div className="prompt-steps">
          <p>Step1: This agent is linked with tools like vegas-user-guide-tool</p>
          <p>Step 2: Parse user question</p>
          <p>Step3: Pick the right tool based on the user questions</p>
          <p>Step4: If questions are related to VEGAS FAQ, then utilize vegas-user-guide-tool</p>
        </div>
      </div>
    </div>
  );
};

export default AgentConfiguration;
