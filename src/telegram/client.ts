/**
 * Telegram Bot API HTTP client.
 * Single place for all Telegram API calls; add new methods here to scale.
 */

const BASE = 'https://api.telegram.org/bot';

export interface TelegramMessage {
  message_id: number;
  from?: { id: number; first_name?: string; username?: string };
  chat: { id: number; type: string };
  date: number;
  text?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

interface GetUpdatesResponse {
  ok: boolean;
  result?: TelegramUpdate[];
  description?: string;
}

interface SendMessageResponse {
  ok: boolean;
  description?: string;
}

export class TelegramClient {
  private baseUrl: string;

  constructor(token: string) {
    this.baseUrl = `${BASE}${token}`;
  }

  /**
   * Get new updates (long polling). Use offset to acknowledge processed updates.
   */
  async getUpdates(offset?: number): Promise<TelegramUpdate[]> {
    const url = new URL(`${this.baseUrl}/getUpdates`);
    if (offset !== undefined) url.searchParams.set('offset', String(offset));
    url.searchParams.set('timeout', '0');

    const res = await fetch(url.toString());
    const data = (await res.json()) as GetUpdatesResponse;

    if (!data.ok) {
      throw new Error(data.description ?? `Telegram API error: ${res.status}`);
    }
    return data.result ?? [];
  }

  /**
   * Send a text message to a chat, optionally as reply to a message.
   */
  async sendMessage(
    chatId: number,
    text: string,
    replyToMessageId?: number
  ): Promise<void> {
    const body: Record<string, unknown> = { chat_id: chatId, text };
    if (replyToMessageId !== undefined) body.reply_to_message_id = replyToMessageId;

    const res = await fetch(`${this.baseUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as SendMessageResponse;
    if (!data.ok) {
      throw new Error(data.description ?? `sendMessage failed: ${res.status}`);
    }
  }
}
