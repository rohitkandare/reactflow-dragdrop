import React, { useState, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react';

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

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  }, [selectedNode, updateNodeData, agentName, agentDescription, modelFamily, modelName, promptInstruction]);

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="w-[320px] h-screen bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 m-0">Agent Configuration</h2>
        <button
          className={`bg-gray-900 text-white border-none px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200
            ${showSuccess ? 'bg-green-500 animate-pulse' : 'hover:bg-gray-700'}
          `}
          onClick={handleSave}
        >
          {showSuccess ? 'Saved!' : 'Save'}
        </button>
      </div>
      <div className="flex-1 p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="mb-5">
          <label htmlFor="agentName" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            id="agentName"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="agentDescription" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
            Agent Description
          </label>
          <textarea
            id="agentDescription"
            value={agentDescription}
            onChange={(e) => setAgentDescription(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y min-h-[80px] font-sans"
          ></textarea>
        </div>
        <div className="mb-5">
          <label htmlFor="modelFamily" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
            Model Family <Info size={14} className="text-gray-400 cursor-help" />
          </label>
          <select
            id="modelFamily"
            value={modelFamily}
            onChange={(e) => setModelFamily(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="Anthropic">Anthropic</option>
            <option value="OpenAI">OpenAI</option>
            <option value="Google">Google</option>
          </select>
        </div>
        <div className="mb-5">
          <label htmlFor="modelName" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
            Model Name <Info size={14} className="text-gray-400 cursor-help" />
          </label>
          <select
            id="modelName"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="Claude 3 Sonnet">Claude 3 Sonnet</option>
            <option value="Claude 3 Opus">Claude 3 Opus</option>
            <option value="GPT-4">GPT-4</option>
            <option value="Gemini Pro">Gemini Pro</option>
          </select>
        </div>
        <div className="mb-5">
          <label htmlFor="promptInstruction" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
            Prompt Instruction <Info size={14} className="text-gray-400 cursor-help" />
          </label>
          <select
            id="promptInstruction"
            value={promptInstruction}
            onChange={(e) => setPromptInstruction(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="">Select a prompt template</option>
            <option value="template1">Template 1</option>
            <option value="template2">Template 2</option>
          </select>
        </div>
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-xs text-gray-500 mb-2">Step1: This agent is linked with tools like vegas-user-guide-tool</p>
          <p className="text-xs text-gray-500 mb-2">Step 2: Parse user question</p>
          <p className="text-xs text-gray-500 mb-2">Step3: Pick the right tool based on the user questions</p>
          <p className="text-xs text-gray-500">Step4: If questions are related to VEGAS FAQ, then utilize vegas-user-guide-tool</p>
        </div>
      </div>
    </div>
  );
};

export default AgentConfiguration;