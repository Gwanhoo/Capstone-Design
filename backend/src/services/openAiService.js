import OpenAI from 'openai';
import { env } from '../config/env.js';

const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

const taskDecompositionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['tasks'],
  properties: {
    tasks: {
      type: 'array',
      minItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'description', 'priority'],
        properties: {
          title: {
            type: 'string',
            description: '칸반 카드에 바로 사용할 수 있는 구체적인 작업 제목',
          },
          description: {
            type: 'string',
            description: '작업 범위와 완료 기준을 요약한 설명',
          },
          priority: {
            type: 'string',
            enum: TASK_PRIORITIES,
            description: '작업의 중요도와 긴급도를 반영한 우선순위',
          },
        },
      },
    },
  },
};

export class OpenAiConfigurationError extends Error {
  constructor(message = 'OpenAI API 키가 설정되지 않았습니다.') {
    super(message);
    this.name = 'OpenAiConfigurationError';
    this.statusCode = 500;
  }
}

export class OpenAiResponseParseError extends Error {
  constructor(message = 'OpenAI 응답을 해석하지 못했습니다.') {
    super(message);
    this.name = 'OpenAiResponseParseError';
    this.statusCode = 502;
  }
}

export class OpenAiRequestError extends Error {
  constructor(message = 'OpenAI 호출에 실패했습니다.') {
    super(message);
    this.name = 'OpenAiRequestError';
    this.statusCode = 502;
  }
}

const getClient = () => {
  if (!env.openAiApiKey) {
    throw new OpenAiConfigurationError();
  }

  return new OpenAI({
    apiKey: env.openAiApiKey,
  });
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

    return {
      title,
      description,
      priority,
    };
  });
};

const parseStructuredResponse = (response) => {
  if (response.output_parsed?.tasks) {
    return validateTasks(response.output_parsed.tasks);
  }

  if (!response.output_text) {
    throw new OpenAiResponseParseError('OpenAI 응답 본문이 비어 있습니다.');
  }

  try {
    const parsed = JSON.parse(response.output_text);
    return validateTasks(parsed.tasks);
  } catch (error) {
    if (error instanceof OpenAiResponseParseError) throw error;
    throw new OpenAiResponseParseError('OpenAI 응답 JSON 파싱에 실패했습니다.');
  }
};

export async function decomposeProject(projectTitle, projectDescription) {
  const title = typeof projectTitle === 'string' ? projectTitle.trim() : '';
  const description = typeof projectDescription === 'string' ? projectDescription.trim() : '';

  if (!title || !description) {
    const error = new Error('프로젝트 제목과 설명은 필수입니다.');
    error.statusCode = 400;
    throw error;
  }

  const client = getClient();

  try {
    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input: [
        {
          role: 'system',
          content: [
            '당신은 소프트웨어 캡스톤 프로젝트를 실행 가능한 칸반 작업으로 분해하는 프로젝트 매니저입니다.',
            '반드시 JSON 스키마를 준수하고, 각 작업은 바로 Todo 컬럼에 추가 가능한 수준으로 구체화하세요.',
            '작업 제목과 설명은 한국어로 작성하고, priority는 low, medium, high, urgent 중 하나만 사용하세요.',
          ].join(' '),
        },
        {
          role: 'user',
          content: `프로젝트명:\n${title}\n\n설명:\n${description}\n\n요구사항:\n- 핵심 기능을 3~12개의 독립적인 작업으로 분해하세요.\n- 구현 순서와 중요도를 고려해 priority를 지정하세요.\n- 응답은 스키마에 맞는 JSON 객체만 반환하세요.`,
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

    return {
      tasks: parseStructuredResponse(response),
    };
  } catch (error) {
    if (
      error instanceof OpenAiConfigurationError ||
      error instanceof OpenAiResponseParseError ||
      error.statusCode === 400
    ) {
      throw error;
    }

    console.error('OpenAI task decomposition failed:', error);
    throw new OpenAiRequestError();
  }
}
