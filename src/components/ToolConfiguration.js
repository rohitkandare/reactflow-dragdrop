import { Info } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import './ToolConfiguration.css';

const ToolConfiguration = ({ selectedTool, updateToolData }) => {
  const [toolName, setToolName] = useState('');
  const [variables, setVariables] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    console.log('ToolConfiguration: selectedTool changed:', selectedTool);
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
      
      // Show success message
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
    <div className="tool-configuration">
      <div className="config-header">
        <h2>Tool Configuration</h2>
        <button 
          className={`save-button ${showSuccess ? 'success' : ''}`} 
          onClick={handleSave}
        >
          {showSuccess ? 'Saved!' : 'Save'}
        </button>
      </div>
      <div className="config-body">
        <div className="form-group">
          <label htmlFor="toolName">
            Tool Name <Info size={14} className="info-icon" />
          </label>
          <input
            type="text"
            id="toolName"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            readOnly
          />
        </div>

        <div className="variables-section">
          <div className="section-header">
            <h3>Variables</h3>
            <button className="add-variable-btn" onClick={addVariable}>
              + Add Variable
            </button>
          </div>
          
          {variables.map((variable, index) => (
            <div key={index} className="variable-group">
              <div className="variable-header">
                <label>
                  Variable <Info size={14} className="info-icon" />
                </label>
                <button 
                  className="remove-variable-btn"
                  onClick={() => removeVariable(index)}
                >
                  ×
                </button>
              </div>
              
              <div className="variable-name">
                <input
                  type="text"
                  value={variable.name}
                  onChange={(e) => updateVariable(index, 'name', e.target.value)}
                  placeholder="Variable name"
                />
              </div>
              
              <div className="variable-type">
                <label>Variable Type</label>
                <select
                  value={variable.type}
                  onChange={(e) => updateVariable(index, 'type', e.target.value)}
                >
                  <option value="Confidential">Confidential</option>
                  <option value="Public">Public</option>
                  <option value="Secret">Secret</option>
                </select>
              </div>
              
              <div className="variable-value">
                <label>Enter Variable Key</label>
                <input
                  type="password"
                  value={variable.value}
                  onChange={(e) => updateVariable(index, 'value', e.target.value)}
                  placeholder="Enter your API key"
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
