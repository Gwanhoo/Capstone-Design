import { DEFAULT_MODEL, OpenAiResponseParseError, getOpenAiClient } from './openAiClient.js';

const DONE_COLUMN_TITLES = new Set(['완료', 'done', '끝', '완료됨']);

const boardAnalysisSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'columnAnalysis', 'memoInsights', 'risks', 'recommendations', 'conclusion'],
  properties: {
    summary: { type: 'string' },
    columnAnalysis: { type: 'array', items: { type: 'string' } },
    memoInsights: { type: 'array', items: { type: 'string' } },
    risks: { type: 'array', items: { type: 'string' } },
    recommendations: { type: 'array', items: { type: 'string' } },
    conclusion: { type: 'string' },
  },
};

const normalizeStringArray = (value) => (Array.isArray(value)
  ? value.map((item) => String(item ?? '').trim()).filter(Boolean).slice(0, 8)
  : []);

const normalizeAnalysis = (analysis) => ({
  summary: String(analysis?.summary ?? '').trim() || '보드 상태 분석 결과를 요약하지 못했습니다.',
  columnAnalysis: normalizeStringArray(analysis?.columnAnalysis),
  memoInsights: normalizeStringArray(analysis?.memoInsights),
  risks: normalizeStringArray(analysis?.risks),
  recommendations: normalizeStringArray(analysis?.recommendations),
  conclusion: String(analysis?.conclusion ?? '').trim() || '현재 보드 상태를 확인하고 우선순위가 높은 작업부터 진행하세요.',
});

const parseAnalysisResponse = (response) => {
  if (response.output_parsed) return normalizeAnalysis(response.output_parsed);

  if (!response.output_text) {
    throw new OpenAiResponseParseError('AI 보드 분석 응답 본문이 비어 있습니다.');
  }

  try {
    return normalizeAnalysis(JSON.parse(response.output_text));
  } catch (_error) {
    return normalizeAnalysis({
      summary: response.output_text,
      conclusion: 'OpenAI 응답이 JSON 형식이 아니어서 원문 요약을 표시합니다.',
    });
  }
};

export const isDoneColumnTitle = (title) => DONE_COLUMN_TITLES.has(String(title ?? '').trim().toLowerCase());

export const buildBoardSnapshot = ({ project, columns, tasks }) => {
  const normalizedColumns = columns.map((column) => {
    const columnTasks = tasks
      .filter((task) => String(task.columnId) === String(column.id))
      .map((task) => ({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'medium',
        memo: task.memo || '',
        isDone: isDoneColumnTitle(column.title),
      }));

    return {
      id: String(column.id),
      name: column.title,
      taskCount: columnTasks.length,
      isDoneColumn: isDoneColumnTitle(column.title),
      tasks: columnTasks,
    };
  });

  const totalTaskCount = tasks.length;
  const doneTaskCount = normalizedColumns
    .filter((column) => column.isDoneColumn)
    .reduce((sum, column) => sum + column.taskCount, 0);

  return {
    project: {
      id: project._id.toString(),
      name: project.name,
      description: project.description || '',
    },
    progress: {
      totalTaskCount,
      doneTaskCount,
      percent: totalTaskCount === 0 ? 0 : Math.round((doneTaskCount / totalTaskCount) * 100),
    },
    columns: normalizedColumns,
  };
};

export const createFallbackAnalysis = (snapshot, reason = 'OpenAI 분석을 사용할 수 없어 보드 데이터 기반 기본 분석을 표시합니다.') => {
  const todoLikeColumns = snapshot.columns.filter((column) => !column.isDoneColumn);
  const highPriorityOpenTasks = todoLikeColumns.flatMap((column) => column.tasks.filter((task) => ['high', 'urgent'].includes(task.priority)));
  const memoTasks = snapshot.columns.flatMap((column) => column.tasks.filter((task) => task.memo));

  return {
    summary: `${reason} 현재 완료 ${snapshot.progress.doneTaskCount}개 / 전체 ${snapshot.progress.totalTaskCount}개로 진행률은 ${snapshot.progress.percent}%입니다.`,
    columnAnalysis: snapshot.columns.map((column) => `${column.name} 컬럼에는 ${column.taskCount}개의 카드가 있습니다.`),
    memoInsights: memoTasks.length > 0
      ? memoTasks.slice(0, 5).map((task) => `${task.title}: ${task.memo}`)
      : ['메모가 작성된 카드가 없어 메모 기반 이슈는 확인되지 않았습니다.'],
    risks: [
      ...(snapshot.progress.percent < 30 && snapshot.progress.totalTaskCount > 0 ? ['완료 비율이 낮아 일정 지연 위험이 있습니다.'] : []),
      ...(highPriorityOpenTasks.length > 0 ? [`완료되지 않은 높은 우선순위 작업이 ${highPriorityOpenTasks.length}개 있습니다.`] : []),
      ...(todoLikeColumns.some((column) => column.taskCount >= 8) ? ['특정 미완료 컬럼에 작업이 몰려 병목이 발생할 수 있습니다.'] : []),
    ],
    recommendations: highPriorityOpenTasks.length > 0
      ? highPriorityOpenTasks.slice(0, 5).map((task) => `${task.title} 작업을 우선 처리하세요.`)
      : ['다음 작업을 명확히 정하고 진행 중 컬럼으로 이동해 실행 흐름을 만드세요.'],
    conclusion: '우선순위가 높은 미완료 작업과 메모에 남은 이슈를 먼저 정리하는 것이 좋습니다.',
  };
};

export const analyzeBoardWithOpenAi = async (snapshot) => {
  const client = getOpenAiClient();

  const response = await client.responses.create({
    model: DEFAULT_MODEL,
    input: [
      {
        role: 'system',
        content: [
          '당신은 칸반 보드 상태를 분석하는 프로젝트 매니저입니다.',
          '열별 카드 분포, 완료 비율, 진행 중 병목, 높은 우선순위 미완료 작업, 카드 메모의 이슈를 종합해 한국어로 간결하게 분석하세요.',
          '발표 자료에 바로 넣을 수 있도록 구체적이고 짧은 문장으로 작성하세요.',
          '반드시 JSON 스키마에 맞는 객체만 반환하세요.',
        ].join(' '),
      },
      {
        role: 'user',
        content: `보드 스냅샷:
${JSON.stringify(snapshot, null, 2)}

분석 기준:
- 각 열별 카드 개수 분포
- 시작 전/할 일 컬럼에 작업이 몰려 있는지
- 진행 중 컬럼 병목 여부
- 완료 컬럼 비율이 낮은지
- 카드 메모에 적힌 이슈, 막힌 부분, 해야 할 일
- 우선순위 높은 작업이 아직 완료되지 않았는지
- 다음에 처리하면 좋은 작업`,
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'kanban_board_analysis',
        strict: true,
        schema: boardAnalysisSchema,
      },
    },
  });

  return parseAnalysisResponse(response);
};

