import { Info } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

const ToolConfiguration = ({ selectedTool, updateToolData }) => {
  const [toolName, setToolName] = useState('');
  const [variables, setVariables] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (selectedTool) {
      setToolName(selectedTool.name || '');
      setVariables(selectedTool.variables || [
        { name: 'env-163844_api', type: 'Confidential', value: '' },
        { name: 'env-147653_api', type: 'Confidential', value: '' }
      ]);
    } else {
      setToolName('');
      setVariables([]);
    }
  }, [selectedTool]);

  const handleSave = useCallback(() => {
    if (selectedTool) {
      const updatedData = {
        name: toolName,
        variables: variables
      };
      updateToolData(selectedTool.id, updatedData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  }, [selectedTool, updateToolData, toolName, variables]);

  const updateVariable = (index, field, value) => {
    const updatedVariables = [...variables];
    updatedVariables[index] = {
      ...updatedVariables[index],
      [field]: value
    };
    setVariables(updatedVariables);
  };

  const addVariable = () => {
    setVariables([...variables, { name: '', type: 'Confidential', value: '' }]);
  };

  const removeVariable = (index) => {
    const updatedVariables = variables.filter((_, i) => i !== index);
    setVariables(updatedVariables);
  };

  if (!selectedTool) {
    return null;
  }

  return (
    <div className="w-[320px] h-screen bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 m-0">Tool Configuration</h2>
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
          <label htmlFor="toolName" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
            Tool Name <Info size={14} className="text-gray-400 cursor-help" />
          </label>
          <input
            type="text"
            id="toolName"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-400 cursor-not-allowed transition-colors"
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 m-0">Variables</h3>
            <button
              className="bg-blue-600 text-white border-none px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-700"
              onClick={addVariable}
            >
              + Add Variable
            </button>
          </div>

          {variables.map((variable, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 m-0">
                  Variable <Info size={14} className="text-gray-400 cursor-help" />
                </label>
                <button
                  className="bg-red-500 text-white border-none w-5 h-5 rounded-full text-sm font-bold cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-red-600"
                  onClick={() => removeVariable(index)}
                >
                  ×
                </button>
              </div>

              <div className="mb-3">
                <label className="text-xs font-medium text-gray-400 mb-1 block">Variable Name</label>
                <input
                  type="text"
                  value={variable.name}
                  onChange={(e) => updateVariable(index, 'name', e.target.value)}
                  placeholder="Variable name"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white transition-colors focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)]"
                />
              </div>

              <div className="mb-3">
                <label className="text-xs font-medium text-gray-400 mb-1 block">Variable Type</label>
                <select
                  value={variable.type}
                  onChange={(e) => updateVariable(index, 'type', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white transition-colors focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)]"
                >
                  <option value="Confidential">Confidential</option>
                  <option value="Public">Public</option>
                  <option value="Secret">Secret</option>
                </select>
              </div>

              <div className="mb-0">
                <label className="text-xs font-medium text-gray-400 mb-1 block">Enter Variable Key</label>
                <input
                  type="password"
                  value={variable.value}
                  onChange={(e) => updateVariable(index, 'value', e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white font-mono transition-colors focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolConfiguration;