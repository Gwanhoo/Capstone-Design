import { DEFAULT_MODEL, OpenAiRequestError, OpenAiResponseParseError, getOpenAiClient } from './openAiClient.js';
import { buildAgentSystemPrompt } from './agents/commonPrompt.js';
import { getAgent } from './agents/index.js';
import { routeAgent } from './agentRouter.js';
import { TASK_PRIORITIES, taskDecompositionSchema } from './taskSchema.js';

const DEFAULT_COLUMNS = ['Todo'];

const normalizeExistingTasks = (existingTasks) => {
  if (!Array.isArray(existingTasks)) return [];

  return existingTasks
    .map((task) => ({
      title: typeof task?.title === 'string' ? task.title.trim() : '',
      status: typeof task?.status === 'string' ? task.status.trim() : 'unknown',
    }))
    .filter((task) => task.title)
    .slice(0, 100);
};

const validateTasks = (tasks) => {
  if (!Array.isArray(tasks)) {
    throw new OpenAiResponseParseError('OpenAI 응답에 tasks 배열이 없습니다.');
  }

  return tasks.map((task) => {
    const title = typeof task.title === 'string' ? task.title.trim() : '';
    const description = typeof task.description === 'string' ? task.description.trim() : '';
    const priority = typeof task.priority === 'string' ? task.priority : 'medium';

    if (!title || !description || !TASK_PRIORITIES.includes(priority)) {
      throw new OpenAiResponseParseError('OpenAI 응답의 작업 형식이 올바르지 않습니다.');
    }

    return { title, description, priority };
  });
};

const normalizeColumns = (columns) => {
  if (!Array.isArray(columns)) {
    throw new OpenAiResponseParseError('OpenAI 응답에 columns 배열이 없습니다.');
  }

  const normalizedColumns = columns.map((column) => ({
    title: typeof column?.title === 'string' && column.title.trim() ? column.title.trim() : 'Todo',
    tasks: validateTasks(column?.tasks),
  }));

  return normalizedColumns.length > 0 ? normalizedColumns : DEFAULT_COLUMNS.map((title) => ({ title, tasks: [] }));
};

const parseTaskResponse = (response) => {
  if (response.output_parsed?.columns) {
    return normalizeColumns(response.output_parsed.columns);
  }

  if (!response.output_text) {
    throw new OpenAiResponseParseError('OpenAI 응답 본문이 비어 있습니다.');
  }

  try {
    const parsed = JSON.parse(response.output_text);
    return normalizeColumns(parsed.columns);
  } catch (error) {
    if (error instanceof OpenAiResponseParseError) throw error;
    throw new OpenAiResponseParseError('OpenAI 응답 JSON 파싱에 실패했습니다.');
  }
};

const flattenColumnsToTasks = (columns) => columns.flatMap((column) => column.tasks);

export async function decomposeProject(projectTitle, projectDescription, options = {}) {
  const title = typeof projectTitle === 'string' ? projectTitle.trim() : '';
  const description = typeof projectDescription === 'string' ? projectDescription.trim() : '';
  const prompt = typeof options.prompt === 'string' ? options.prompt.trim() : '';
  const existingTasks = normalizeExistingTasks(options.existingTasks);

  if (!title || !description) {
    const error = new Error('프로젝트 제목과 설명은 필수입니다.');
    error.statusCode = 400;
    throw error;
  }

  const client = getOpenAiClient();
  const routing = await routeAgent({ projectTitle: title, projectDescription: description, prompt });
  const selectedAgent = await getAgent(routing.agentType);

  try {
    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input: [
        {
          role: 'system',
          content: buildAgentSystemPrompt(selectedAgent),
        },
        {
          role: 'user',
          content: `프로젝트명:
${title}

설명:
${description}

사용자 추가 요청:
${prompt || '추가 요청 없음'}

선택된 Agent:
${JSON.stringify({ type: selectedAgent.type, name: selectedAgent.name, description: selectedAgent.description }, null, 2)}

기존 작업 목록(Todo/In Progress/Done 전체, 중복 추천 금지):
${JSON.stringify(existingTasks, null, 2)}

요구사항:
- 프로젝트 정보, 사용자 추가 요청, 기존 작업 목록을 모두 참고하세요.
- 이미 존재하는 작업은 다시 추천하지 마세요.
- status가 done인 완료 작업은 다시 추천하지 마세요.
- 유사한 제목이나 같은 의미의 작업도 중복 추천하지 마세요.
- 새로 필요한 핵심 작업을 최대 12개의 독립적인 작업으로 분해하세요. 중복을 제외하면 추천할 작업이 없을 수 있습니다.
- Agent 전문성에 맞는 순서와 관점으로 작업을 구성하세요.
- 기존 Kanban Column 구조와 호환되도록 columns 배열을 반환하고, 새 추천 작업은 Todo 컬럼에 넣으세요.
- 구현 순서와 중요도를 고려해 priority를 지정하세요.
- 응답은 스키마에 맞는 JSON 객체만 반환하세요.`,
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'project_task_decomposition',
          strict: true,
          schema: taskDecompositionSchema,
        },
      },
    });

    const columns = parseTaskResponse(response);

    return {
      selectedAgentType: selectedAgent.type,
      confidence: routing.confidence,
      reason: routing.reason,
      columns,
      tasks: flattenColumnsToTasks(columns),
    };
  } catch (error) {
    if (error instanceof OpenAiResponseParseError || error.statusCode === 400) {
      throw error;
    }

    console.error('OpenAI task decomposition failed:', error);
    throw new OpenAiRequestError();
  }
}
