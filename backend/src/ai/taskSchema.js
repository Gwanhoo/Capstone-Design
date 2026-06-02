export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const generatedTaskSchema = {
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
};

export const taskDecompositionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['columns'],
  properties: {
    columns: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'tasks'],
        properties: {
          title: {
            type: 'string',
            description: '기존 칸반 보드 컬럼 제목. 새로 생성할 추천 작업은 Todo 컬럼에 배치합니다.',
          },
          tasks: {
            type: 'array',
            items: generatedTaskSchema,
          },
        },
      },
    },
  },
};

export const routerSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['agentType', 'confidence', 'reason'],
  properties: {
    agentType: {
      type: 'string',
      description: '선택한 Agent type',
    },
    confidence: {
      type: 'number',
      description: 'Agent 선택 신뢰도. 0 이상 1 이하의 숫자입니다.',
    },
    reason: {
      type: 'string',
      description: '해당 Agent를 선택한 이유를 한국어로 간단히 설명합니다.',
    },
  },
};
