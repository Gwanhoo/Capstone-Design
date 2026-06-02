import OpenAI from 'openai';
import { env } from '../config/env.js';

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

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

export const getOpenAiClient = () => {
  if (!env.openAiApiKey) {
    throw new OpenAiConfigurationError();
  }

  return new OpenAI({
    apiKey: env.openAiApiKey,
  });
};
