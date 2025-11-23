// Import modules
import { GoogleGenAI } from "@google/genai";
import { readUnicodeFileSync } from './utils/file.utils.js';
import { replaceTemplatePlaceholders } from './utils/regex.utils.js';
import env from './environment.js';

/**
 * Translate text from Vietnamese to Chinese using Gemini AI
 * @param {string} text - Text to translate (with placeholders)
 * @param {object} options - Translation options
 * @param {string} options.model - AI model to use (default from env.DEFAULT_MODEL)
 * @param {string} options.systemPrompt - Path to system prompt file (default from env.DEFAULT_SYSTEM_PROMPT)
 * @param {string} options.template - Path to translation template file (default from env.TRANSLATION_TEMPLATE)
 * @returns {Promise<string>} - Translated text
 */
async function translate(text, options = {}) {
    const {
        model = env.DEFAULT_MODEL,
        systemPrompt = env.DEFAULT_SYSTEM_PROMPT,
        template = env.TRANSLATION_TEMPLATE
    } = options;

    const ai = new GoogleGenAI({
        apiKey: env.GOOGLE_API_KEY,
    });
    
    const tools = [];
    const config = {
        thinkingConfig: {
            thinkingBudget: -1,
        },
        tools,
        systemInstruction: readUnicodeFileSync(systemPrompt),
    };
    
    // Load template and replace placeholders
    const templateContent = readUnicodeFileSync(template);
    const contents = replaceTemplatePlaceholders(templateContent, {
        text: text
    });
    
    const response = await ai.models.generateContent({
        model,
        contents,
        config,
    });
    
    // console.log(response.text);
    return response.text;
}

export { translate };

