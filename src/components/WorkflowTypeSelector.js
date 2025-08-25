import { ArrowRight, Network, Play, User } from 'lucide-react';
import React, { useState } from 'react';
import './WorkflowTypeSelector.css';

const WorkflowTypeSelector = ({ onWorkflowTypeSelect, onClose }) => {
  const [selectedType, setSelectedType] = useState(null);

  const workflowTypes = [
    {
      id: 'single',
      title: 'Single Agent',
      description: 'Create a workflow with a single agent that handles all tasks independently.',
      icon: User,
      color: '#3b82f6',
      features: [
        'One agent handles all workflow tasks',
        'Simple and straightforward setup',
        'Ideal for focused, single-purpose workflows'
      ]
    },
    {
      id: 'sequential',
      title: 'Sequential Agent',
      description: 'Create a workflow where multiple agents work in sequence, passing results from one to the next.',
      icon: ArrowRight,
      color: '#10b981',
      features: [
        'Multiple agents work in sequence',
        'Data flows from one agent to the next',
        'Ideal for multi-step processes'
      ]
    },
    {
      id: 'hierarchical',
      title: 'Hierarchical Agent',
      description: 'Create a workflow with a master agent that coordinates multiple specialized agents.',
      icon: Network,
      color: '#8b5cf6',
      features: [
        'Master agent coordinates workflow',
        'Specialized agents for specific tasks',
        'Ideal for complex, orchestrated workflows'
      ]
    }
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleStartWorkflow = () => {
    if (selectedType) {
      onWorkflowTypeSelect(selectedType);
    }
  };

  return (
    <div className="workflow-selector-overlay">
      <div className="workflow-selector-modal">
        <div className="modal-header">
          <h2>Choose Workflow Type</h2>
          <p>Select the type of workflow you want to create</p>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="workflow-types">
          {workflowTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.id}
                className={`workflow-type-card ${selectedType?.id === type.id ? 'selected' : ''}`}
                onClick={() => handleTypeSelect(type)}
              >
                <div className="type-icon" style={{ backgroundColor: type.color }}>
                  <IconComponent size={24} color="white" />
                </div>
                <div className="type-content">
                  <h3>{type.title}</h3>
                  <p>{type.description}</p>
                  <ul className="type-features">
                    {type.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="selection-indicator">
                  {selectedType?.id === type.id && (
                    <div className="checkmark">✓</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`start-button ${selectedType ? 'active' : 'disabled'}`}
            onClick={handleStartWorkflow}
            disabled={!selectedType}
          >
            <Play size={16} />
            Start Workflow
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTypeSelector;
