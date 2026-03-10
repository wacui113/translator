/**
 * Environment and CLI configuration.
 * Resolution order: CLI flag > env var > default.
 */

import dotenv from 'dotenv';
import { program } from 'commander';

dotenv.config();

export interface EnvConfig {
  GOOGLE_API_KEY: string;
  DEFAULT_MODEL: string;
  DEFAULT_SYSTEM_PROMPT: string;
  TRANSLATION_TEMPLATE: string;
  INPUT_FILE: string;
  OUTPUT_FILE: string;
  NODE_ENV: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_BOT_ID: string;
  TELEGRAM_POLL_INTERVAL_MS: string;
}

function getEnv(key: string, defaultValue = ''): string {
  return process.env[key] ?? defaultValue;
}

function resolveValue(flagVal: string | undefined, envKey: string, defaultVal: string): string {
  if (flagVal !== undefined && flagVal !== '') return flagVal;
  const envVal = getEnv(envKey);
  if (envVal !== '') return envVal;
  return defaultVal;
}

let resolvedConfig: EnvConfig | null = null;

/**
 * Parse CLI and env, then return config. Call once at startup.
 */
export function loadEnv(argv: string[] = process.argv): EnvConfig {
  if (resolvedConfig) return resolvedConfig;

  program
    .name('translator')
    .description('Vietnamese to Chinese translator (Gemini AI)')
    .version('1.0.0')
    .option('-k, --key <key>', 'Google API Key')
    .option('-m, --model <model>', 'Gemini model', '')
    .option('-p, --prompt <path>', 'System prompt file path', '')
    .option('-t, --template <path>', 'Translation template file path', '')
    .option('-i, --input <path>', 'Input file path', '')
    .option('-o, --output <path>', 'Output file path', '')
    .option('-e, --env <env>', 'Node environment (development/production)', '')
    .option('-T, --telegram-token <token>', 'Telegram bot token')
    .option('--telegram-bot-id <id>', 'Telegram bot user ID (optional)')
    .option('--telegram-poll-interval <ms>', 'Telegram poll interval in milliseconds', '')
    .parse(argv);

  const opts = program.opts<{
    key?: string;
    model?: string;
    prompt?: string;
    template?: string;
    input?: string;
    output?: string;
    env?: string;
    telegramToken?: string;
    telegramBotId?: string;
    telegramPollInterval?: string;
  }>();

  resolvedConfig = {
    GOOGLE_API_KEY: resolveValue(opts.key, 'GOOGLE_API_KEY', ''),
    DEFAULT_MODEL: resolveValue(opts.model, 'DEFAULT_MODEL', 'gemini-2.5-pro'),
    DEFAULT_SYSTEM_PROMPT: resolveValue(opts.prompt, 'DEFAULT_SYSTEM_PROMPT', 'prompt/system_prompt_v3.md'),
    TRANSLATION_TEMPLATE: resolveValue(opts.template, 'TRANSLATION_TEMPLATE', 'prompt/translation_template.md'),
    INPUT_FILE: resolveValue(opts.input, 'INPUT_FILE', 'original.txt'),
    OUTPUT_FILE: resolveValue(opts.output, 'OUTPUT_FILE', 'output_final.txt'),
    NODE_ENV: resolveValue(opts.env, 'NODE_ENV', 'development'),
    TELEGRAM_BOT_TOKEN: resolveValue(opts.telegramToken, 'TELEGRAM_BOT_TOKEN', ''),
    TELEGRAM_BOT_ID: resolveValue(opts.telegramBotId, 'TELEGRAM_BOT_ID', ''),
    TELEGRAM_POLL_INTERVAL_MS: resolveValue(opts.telegramPollInterval, 'TELEGRAM_POLL_INTERVAL_MS', '30000'),
  };

  return resolvedConfig;
}

/**
 * Get current config. Must call loadEnv() first.
 */
export function getConfig(): EnvConfig {
  if (!resolvedConfig) return loadEnv();
  return resolvedConfig;
}

export { program };
