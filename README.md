# Asset Library Workflow Builder

A React application that recreates the exact UI from the provided screenshots, featuring an Asset Library sidebar and a workflow diagram builder.

## Features

- **Asset Library Sidebar**: 
  - Add new Agent and Tool buttons
  - Toggle between "My Agents" and "Tools" tabs
  - Search functionality for agents and tools
  - Scrollable list of existing assets

- **Workflow Canvas**:
  - Interactive flow diagram with custom nodes
  - Start/End nodes
  - Master Agent node (Supervisor)
  - Multiple Agent nodes with expandable Tools sections
  - Drag and drop functionality
  - Smooth connections between nodes

## Screenshots Recreated

The application recreates the exact UI from the provided screenshots, including:
- Asset Library sidebar with proper styling and layout
- Workflow diagram with custom node designs
- Agent nodes with tools sections
- Proper color schemes and typography
- Interactive elements and hover states

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Dependencies

- React 18.2.0
- React Flow Renderer 10.3.17
- Lucide React 0.263.1
- React Scripts 5.0.1

## Project Structure

```
src/
├── components/
│   ├── AssetLibrary.js          # Asset Library sidebar component
│   ├── AssetLibrary.css         # Styles for Asset Library
│   └── NodeStyles.css           # Styles for custom workflow nodes
├── data/
│   └── workflowData.js          # Workflow nodes, edges, and custom node components
├── App.js                       # Main application component
├── App.css                      # Main application styles
├── index.js                     # Application entry point
└── index.css                    # Global styles
```

## Customization

The application is built with modular components that can be easily customized:

- **Asset Library**: Modify the agents and tools data in `AssetLibrary.js`
- **Workflow Nodes**: Update node designs in `NodeStyles.css`
- **Node Data**: Change node positions and data in `workflowData.js`

## Browser Support

The application works in all modern browsers that support React 18 and CSS Grid/Flexbox.
