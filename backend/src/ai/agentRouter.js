import { DEFAULT_MODEL, OpenAiResponseParseError, getOpenAiClient } from './openAiClient.js';
import { buildAgentCatalog, getFallbackAgentType, loadAgents } from './agents/index.js';
import { routerSchema } from './taskSchema.js';

const clampConfidence = (confidence) => {
  const value = Number(confidence);
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
};

const parseRouterResponse = (response) => {
  if (response.output_parsed) return response.output_parsed;

  if (!response.output_text) {
    throw new OpenAiResponseParseError('Router Agent 응답 본문이 비어 있습니다.');
  }

  try {
    return JSON.parse(response.output_text);
  } catch (_error) {
    throw new OpenAiResponseParseError('Router Agent 응답 JSON 파싱에 실패했습니다.');
  }
};

const normalizeRoutingResult = async (routingResult) => {
  const agents = await loadAgents();
  const fallbackAgentType = getFallbackAgentType();
  const requestedAgentType = typeof routingResult?.agentType === 'string' ? routingResult.agentType.trim() : '';
  const agentType = agents[requestedAgentType] ? requestedAgentType : fallbackAgentType;
  const confidence = agentType === requestedAgentType ? clampConfidence(routingResult?.confidence) : 0;
  const reason = typeof routingResult?.reason === 'string' && routingResult.reason.trim()
    ? routingResult.reason.trim()
    : 'Router Agent 결과가 불완전하여 General Agent를 사용합니다.';

  return {
    agentType,
    confidence,
    reason: agentType === requestedAgentType ? reason : `${reason} 선택 가능한 Agent가 아니어서 General Agent로 대체했습니다.`,
  };
};

export const routeAgent = async ({ projectTitle, projectDescription, prompt }) => {
  const client = getOpenAiClient();
  const agentCatalog = await buildAgentCatalog();

  try {
    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input: [
        {
          role: 'system',
          content: [
            '당신은 사용자 요청을 분석해 가장 적합한 Task Decomposition Agent를 선택하는 Router Agent입니다.',
            '키워드 하나에 의존하지 말고 프로젝트 제목, 설명, 사용자 추가 요청의 목적과 맥락을 종합적으로 판단하세요.',
            '반드시 제공된 Agent 목록 중 하나의 type을 선택하세요.',
            '분류가 애매하거나 신뢰도가 낮으면 general을 선택하세요.',
            'reason은 한국어로 작성하세요.',
          ].join(' '),
        },
        {
          role: 'user',
          content: `Agent 목록:
${JSON.stringify(agentCatalog, null, 2)}

프로젝트명:
${projectTitle}

설명:
${projectDescription}

사용자 추가 요청:
${prompt || '추가 요청 없음'}

응답 예시:
{"agentType":"travel","confidence":0.93,"reason":"여행 계획 관련 요청으로 판단"}`,
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'agent_routing',
          strict: true,
          schema: routerSchema,
        },
      },
    });

    return normalizeRoutingResult(parseRouterResponse(response));
  } catch (error) {
    if (error instanceof OpenAiResponseParseError) {
      console.error('Router Agent response parsing failed:', error);
      return {
        agentType: getFallbackAgentType(),
        confidence: 0,
        reason: 'Router Agent 응답 해석에 실패하여 General Agent를 사용합니다.',
      };
    }

    console.error('Router Agent request failed:', error);
    return {
      agentType: getFallbackAgentType(),
      confidence: 0,
      reason: 'Router Agent 호출에 실패하여 General Agent를 사용합니다.',
    };
  }
};
