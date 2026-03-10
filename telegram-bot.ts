/**
 * Telegram bot server: poll for new text messages, run translation pipeline, reply with result.
 * Run: npm run telegram (or node dist/telegram-bot.js)
 */

import dotenv from 'dotenv';
dotenv.config();

import { loadEnv, getConfig } from './src/environment.js';
import { runTranslationPipeline } from './src/pipeline.js';
import { TelegramClient } from './src/telegram/client.js';

const POLL_INTERVAL_MS = 30_000;

async function main(): Promise<void> {
  loadEnv();
  const config = getConfig();

  if (!config.TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN is required. Set it in .env or environment.');
    process.exit(1);
  }
  if (!config.GOOGLE_API_KEY) {
    console.error('❌ GOOGLE_API_KEY is required. Set it in .env or environment.');
    process.exit(1);
  }

  const intervalMs = Math.max(1000, parseInt(config.TELEGRAM_POLL_INTERVAL_MS, 10) || POLL_INTERVAL_MS);
  const client = new TelegramClient(config.TELEGRAM_BOT_TOKEN);

  console.log('🤖 Telegram translation bot started.');
  console.log(`   Poll interval: ${intervalMs}ms`);
  console.log('   Waiting for messages...\n');

  let offset: number | undefined;

  while (true) {
    try {
      const updates = await client.getUpdates(offset);

      const withText = updates.filter((u) => u.message?.text?.trim());
      const latest = withText.length > 0 ? withText[withText.length - 1]! : null;

      if (latest?.message) {
        const msg = latest.message;
        const chatId = msg.chat.id;
        const messageId = msg.message_id;
        const text = msg.text!.trim();
        offset = latest.update_id + 1;

        console.log(`📩 Message from chat ${chatId}: "${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`);

        try {
          const translated = await runTranslationPipeline(text);
          const toSend = translated.length > 4096 ? translated.slice(0, 4093) + '...' : translated;
          await client.sendMessage(chatId, toSend, messageId);
          console.log(`   ✓ Replied with translation (${translated.length} chars)\n`);
        } catch (err) {
          console.error('   Translation or send error:', err);
          await client.sendMessage(chatId, `Translation failed: ${err instanceof Error ? err.message : String(err)}`, messageId).catch(() => {});
        }
      } else if (updates.length > 0) {
        offset = Math.max(...updates.map((u) => u.update_id)) + 1;
      }
    } catch (err) {
      console.error('Poll error:', err);
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

main();
