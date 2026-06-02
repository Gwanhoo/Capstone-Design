export const COMMON_TASK_GENERATION_RULES = [
  '모든 작업 제목과 설명은 한국어로 작성합니다.',
  '각 작업은 담당자가 바로 실행할 수 있는 실제 행동 중심 문장으로 작성합니다.',
  '“프로젝트 진행”, “조사하기”처럼 모호하거나 큰 단위의 작업은 금지합니다.',
  '작업은 가능한 한 작은 단위로 분해하고, 선행 작업과 실행 순서를 고려합니다.',
  '이미 존재하거나 완료된 작업, 그리고 기존 작업과 제목/의미가 유사한 작업은 절대 다시 추천하지 않습니다.',
  '새로 필요한 핵심 작업을 최대 12개까지 생성하고, 중복을 제외하면 작업 수가 0개일 수 있습니다.',
  'priority는 low, medium, high, urgent 중 하나만 사용합니다.',
  '응답은 JSON 스키마에 맞는 객체만 반환합니다.',
  '기존 Kanban 호환성을 위해 columns 배열을 반환하고, 새 추천 작업은 title이 “Todo”인 컬럼의 tasks 배열에 넣습니다.',
];

export const buildAgentSystemPrompt = (agent) => [
  agent.prompt,
  '',
  '공통 Task 생성 규칙:',
  ...COMMON_TASK_GENERATION_RULES.map((rule) => `- ${rule}`),
].join('\n');
