import { GoogleGenAI } from '@google/genai';
import { readUnicodeFileSync } from './utils/file.utils.js';
import { replaceTemplatePlaceholders } from './utils/regex.utils.js';
import { getConfig } from './environment.js';

export interface TranslateOptions {
  model?: string;
  systemPrompt?: string;
  template?: string;
}

/**
 * Translate text from Vietnamese to Chinese using Gemini AI.
 */
export async function translate(text: string, options: TranslateOptions = {}): Promise<string> {
  const config = getConfig();
  const model = options.model ?? config.DEFAULT_MODEL;
  const systemPrompt = options.systemPrompt ?? config.DEFAULT_SYSTEM_PROMPT;
  const template = options.template ?? config.TRANSLATION_TEMPLATE;

  const ai = new GoogleGenAI({ apiKey: config.GOOGLE_API_KEY });
  const systemInstruction = readUnicodeFileSync(systemPrompt);
  const templateContent = readUnicodeFileSync(template);
  const contents = replaceTemplatePlaceholders(templateContent, { text });

  const configPayload = {
    thinkingConfig: { thinkingBudget: -1 },
    tools: [],
    systemInstruction,
  };

  const response = await ai.models.generateContent({
    model,
    contents,
    config: configPayload,
  });

  return response.text ?? '';
}
