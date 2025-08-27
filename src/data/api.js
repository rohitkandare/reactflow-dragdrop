import { SECURITY_CONFIG } from '../config/security';

const mapToolRecord = (rec) => ({
  id: rec.tool_id,
  name: rec.tool_name,
  description: rec.tool_description,
  env_config_params: Array.isArray(rec.env_config_params) ? rec.env_config_params : []
});

const mapAgentRecord = (rec) => ({
  id: String(rec.id ?? rec.name ?? Math.random()),
  name: rec.name,
  description: rec.backstory || '',
  raw: rec
});

// Fallback mock based on provided API response
const MOCK_TOOLS_RESPONSE = {
  response: {
    details: [
      {
        tool_id: '0f411225-cf39-426e-a091-947e68735699_20250826050159',
        tool_name: 'query-service',
        tool_description: 'fetch filtered data from endpoint return a compact, normalized result so the never sees hug json',
        env_config_params: []
      },
      {
        tool_id: '3afb0c8e-ed2a-4994-8c62-6d6788b8f858_20250821131036',
        tool_name: 'netool',
        tool_description: 'tool new',
        env_config_params: []
      },
      {
        tool_id: 'f3655cf3-7b34-4291-b82f-088374adb2d0_20250821100540',
        tool_name: 'newtool1234',
        tool_description: 'new tool',
        env_config_params: []
      },
      {
        tool_id: '2b795f8a-923f-490c-975e-1620a99818e8_20250821082808',
        tool_name: 'newtool123',
        tool_description: 'bilaps tool',
        env_config_params: []
      },
      {
        tool_id: 'a037c11f-9792-47eb-beb7-285d3a31b205_20250820115247',
        tool_name: 'get-all-jira-projects',
        tool_description: 'To get all JIRA Projects',
        env_config_params: [
          { name: 'env_161611_jira_token', type: 'Confidential' }
        ]
      },
      {
        tool_id: '79f7e106-cc84-42e5-be45-7bdc86572fbf_20250814172210',
        tool_name: 'osp-cable-tool',
        tool_description: 'This tool, queries a remote data service to retrieve information on fiber optic cables.',
        env_config_params: []
      },
      {
        tool_id: '15808779-3dac-4ce4-a33e-9dd186ef0186_20250812074508',
        tool_name: 'get-osp-cables-1',
        tool_description: 'This for executing a query against  remote data service endpoint, it receives necessary parameters such as service url, token, where_cluase and output fields. The tool constructs the request, perform the query and returns the response data in a structure format',
        env_config_params: []
      },
      {
        tool_id: 'e32cd663-d891-4e8f-a834-efe16ffe2d30_20250811113336',
        tool_name: 'get-osp-cables',
        tool_description: 'This for executing a query against  remote data service endpoint, it receives necessary parameters such as service url, token, where_cluase and output fields. The tool constructs the request, perform the query and returns the response data in a structure format',
        env_config_params: []
      },
      {
        tool_id: '15659d9e-3045-4966-98de-a1d353edf2a6_20250808091929',
        tool_name: 'sometoolxy123',
        tool_description: 'this is a json parsing tool',
        env_config_params: []
      }
    ]
  }
};

// Fallback mock for agents based on provided sample response
const MOCK_AGENTS_RESPONSE = {
  response: {
    data: [
      {
        name: 'testagent',
        backstory: 'Step 1: Parse the Query... (truncated)',
        role: 'leader',
        type: 'freelancer_root',
        id: 986,
        skills: []
      },
      {
        name: 'teststssbjy',
        backstory: '1) Engage process_document tool... (truncated)',
        role: 'addition',
        type: 'freelancer_root',
        id: 985,
        skills: [
          {
            id: 'd64546b2-ae1d-4549-8ec1-53f1f27ea808_20250411110606',
            name: 'add-number-env',
            env_config_params: [
              { name: 'env_736260_test_number', type: 'Non-Confidential' }
            ]
          }
        ]
      },
      {
        name: 'adawd',
        backstory: '1) Engage process_document tool... (truncated)',
        role: 'sdxmashxjasj',
        type: 'freelancer_root',
        id: 984,
        skills: [
          {
            id: '2603b161-8f77-40ef-a5b8-c812d6890461_20250626090743',
            name: 'test-tool-add',
            env_config_params: []
          }
        ]
      },
      {
        name: 'testing',
        backstory: 'Step 1: Parse the Query... (truncated)',
        role: 'math',
        type: 'freelancer_root',
        id: 979,
        skills: []
      }
    ],
    count: 4
  }
};

export async function fetchToolsFromApi(signal, { query = '', page, pageSize } = {}) {
  const baseUrl = SECURITY_CONFIG.apiUrl;
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (typeof page === 'number') params.set('page', String(page));
  if (typeof pageSize === 'number') params.set('pageSize', String(pageSize));
  const queryStr = params.toString();
  const url = `${baseUrl}/tools${queryStr ? `?${queryStr}` : ''}`;
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`Failed to fetch tools: ${res.status}`);
    const data = await res.json();
    const details = data?.response?.details;
    const totalCount = Number(data?.response?.total_count) || (details?.length || 0);
    if (Array.isArray(details)) return { tools: details.map(mapToolRecord), totalCount };
    // Fallback to mock if shape is unexpected
    const all = (MOCK_TOOLS_RESPONSE.response.details || []).map(mapToolRecord);
    const filtered = query ? all.filter(t => t.name.toLowerCase().includes(query.toLowerCase())) : all;
    return { tools: filtered, totalCount: Number(MOCK_TOOLS_RESPONSE.response.total_count) || filtered.length };
  } catch (e) {
    // Network or server error: use provided mock
    const all = (MOCK_TOOLS_RESPONSE.response.details || []).map(mapToolRecord);
    const filtered = query ? all.filter(t => t.name.toLowerCase().includes(query.toLowerCase())) : all;
    return { tools: filtered, totalCount: Number(MOCK_TOOLS_RESPONSE.response.total_count) || filtered.length };
  }
}

// Fetch agents with count; expects shape: { response: { data: [...], count: number } }
export async function fetchAgentsFromApi(signal, { query = '', page, pageSize } = {}) {
  const baseUrl = SECURITY_CONFIG.apiUrl;
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (typeof page === 'number') params.set('page', String(page));
  if (typeof pageSize === 'number') params.set('pageSize', String(pageSize));
  const queryStr = params.toString();
  const url = `${baseUrl}/agents${queryStr ? `?${queryStr}` : ''}`;
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`);
    const data = await res.json();
    const list = data?.response?.data;
    const count = Number(data?.response?.count) || (list?.length || 0);
    if (Array.isArray(list)) return { agents: list.map(mapAgentRecord), totalCount: count };
    const all = (MOCK_AGENTS_RESPONSE.response.data || []).map(mapAgentRecord);
    const filtered = query ? all.filter(a => a.name.toLowerCase().includes(query.toLowerCase())) : all;
    return {
      agents: filtered,
      totalCount: Number(MOCK_AGENTS_RESPONSE.response.count) || filtered.length
    };
  } catch (e) {
    const all = (MOCK_AGENTS_RESPONSE.response.data || []).map(mapAgentRecord);
    const filtered = query ? all.filter(a => a.name.toLowerCase().includes(query.toLowerCase())) : all;
    return {
      agents: filtered,
      totalCount: Number(MOCK_AGENTS_RESPONSE.response.count) || filtered.length
    };
  }
}


