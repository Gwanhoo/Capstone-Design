import {
  OpenAiConfigurationError,
  OpenAiRequestError,
  OpenAiResponseParseError,
  decomposeProject,
} from '../services/openAiService.js';

export const decomposeProjectTasks = async (req, res) => {
  const { projectTitle, projectDescription, prompt, existingTasks } = req.body;

  try {
    const data = await decomposeProject(projectTitle, projectDescription, { prompt, existingTasks });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof OpenAiConfigurationError) {
      return res.status(error.statusCode).json({
        success: false,
        message: 'OpenAI API 키가 설정되지 않았습니다.',
      });
    }

    if (error instanceof OpenAiRequestError) {
      return res.status(error.statusCode).json({
        success: false,
        message: 'OpenAI 호출에 실패했습니다.',
      });
    }

    if (error instanceof OpenAiResponseParseError) {
      return res.status(error.statusCode).json({
        success: false,
        message: 'OpenAI 응답 JSON 파싱에 실패했습니다.',
      });
    }

    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message ?? 'AI 작업 생성 실패',
    });
  }
};
