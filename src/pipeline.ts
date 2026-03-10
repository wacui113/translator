/**
 * Reusable translation pipeline: input text → extract placeholders → translate → restore → output text.
 * Used by both CLI (file mode) and Telegram bot.
 */

import {
  matchVietnameseNames,
  matchProductCodes,
  matchParenthesesContent,
  matchEnglishNames,
  matchAcronyms,
  resetGlobalMapping,
  restorePlaceholders,
} from './utils/regex.utils.js';
import { translate } from './translator.js';

/**
 * Run the full translation pipeline on input text.
 * Resets global placeholder mapping at the start of each run.
 */
export async function runTranslationPipeline(inputText: string): Promise<string> {
  resetGlobalMapping();
  let text = inputText.normalize('NFC');

  text = matchVietnameseNames(text).text;
  text = matchProductCodes(text).text;
  text = matchParenthesesContent(text).text;
  text = matchEnglishNames(text).text;
  text = matchAcronyms(text).text;

  const translated = await translate(text);
  return restorePlaceholders(translated);
}
