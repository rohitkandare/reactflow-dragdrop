// Tool catalog sourced from provided external data
// Maps raw tool records to the minimal shape used by the UI

export const AVAILABLE_TOOLS = [
  {
    id: "0f411225-cf39-426e-a091-947e68735699_20250826050159",
    name: "query-service",
    description: "fetch filtered data from endpoint return a compact, normalized result",
    env_config_params: []
  },
  {
    id: "3afb0c8e-ed2a-4994-8c62-6d6788b8f858_20250821131036",
    name: "netool",
    description: "tool new",
    env_config_params: []
  },
  {
    id: "f3655cf3-7b34-4291-b82f-088374adb2d0_20250821100540",
    name: "newtool1234",
    description: "new tool",
    env_config_params: []
  },
  {
    id: "2b795f8a-923f-490c-975e-1620a99818e8_20250821082808",
    name: "newtool123",
    description: "bilaps tool",
    env_config_params: []
  },
  {
    id: "a037c11f-9792-47eb-beb7-285d3a31b205_20250820115247",
    name: "get-all-jira-projects",
    description: "To get all JIRA Projects",
    env_config_params: [
      { name: "env_161611_jira_token", type: "Confidential" }
    ]
  },
  {
    id: "79f7e106-cc84-42e5-be45-7bdc86572fbf_20250814172210",
    name: "osp-cable-tool",
    description: "queries a remote data service to retrieve information on fiber optic cables",
    env_config_params: []
  },
  {
    id: "15808779-3dac-4ce4-a33e-9dd186ef0186_20250812074508",
    name: "get-osp-cables-1",
    description: "Executes a query against remote data service endpoint for cable info",
    env_config_params: []
  },
  {
    id: "e32cd663-d891-4e8f-a834-efe16ffe2d30_20250811113336",
    name: "get-osp-cables",
    description: "Queries ArcGIS feature service to retrieve cable features",
    env_config_params: []
  },
  {
    id: "15659d9e-3045-4966-98de-a1d353edf2a6_20250808091929",
    name: "sometoolxy123",
    description: "json parsing tool for activation anomalies",
    env_config_params: []
  }
];


