import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AGENT_FILE_SUFFIX = '.agent.js';
const FALLBACK_AGENT_TYPE = 'general';

let cachedAgents;

const validateAgent = (agent, fileName) => {
  if (!agent || typeof agent !== 'object') {
    throw new Error(`${fileName} Agent 설정이 객체가 아닙니다.`);
  }

  const type = typeof agent.type === 'string' ? agent.type.trim() : '';
  const name = typeof agent.name === 'string' ? agent.name.trim() : '';
  const description = typeof agent.description === 'string' ? agent.description.trim() : '';
  const prompt = typeof agent.prompt === 'string' ? agent.prompt.trim() : '';

  if (!type || !name || !description || !prompt) {
    throw new Error(`${fileName} Agent 설정에 type, name, description, prompt가 필요합니다.`);
  }

  return { ...agent, type, name, description, prompt };
};

export const loadAgents = async () => {
  if (cachedAgents) return cachedAgents;

  const files = (await readdir(__dirname))
    .filter((fileName) => fileName.endsWith(AGENT_FILE_SUFFIX))
    .sort();

  const entries = await Promise.all(files.map(async (fileName) => {
    const moduleUrl = pathToFileURL(path.join(__dirname, fileName)).href;
    const module = await import(moduleUrl);
    const agent = validateAgent(module.default, fileName);
    return [agent.type, agent];
  }));

  cachedAgents = Object.freeze(Object.fromEntries(entries));
  return cachedAgents;
};

export const getFallbackAgentType = () => FALLBACK_AGENT_TYPE;

export const getAgent = async (agentType) => {
  const agents = await loadAgents();
  return agents[agentType] ?? agents[FALLBACK_AGENT_TYPE];
};

export const buildAgentCatalog = async () => {
  const agents = await loadAgents();
  return Object.values(agents).map((agent) => ({
    type: agent.type,
    name: agent.name,
    description: agent.description,
  }));
};
