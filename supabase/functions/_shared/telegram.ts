/**
 * Уведомление тренеру в Telegram.
 *
 * Токен берём у существующего бота Федерации — заводить второго ради одного
 * сообщения незачем. Адресат лежит в trainers.telegram_chat_id, колонка
 * закрыта грантом от клиентов.
 */
export async function notifyTelegram(chatId: string, text: string): Promise<boolean> {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!token || !chatId) {
    console.warn('Telegram не настроен — уведомление не отправлено');
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      // Тело ответа Telegram содержит токен только в URL, не в теле —
      // логировать его безопасно.
      console.error('Telegram отклонил сообщение', response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Не удалось отправить сообщение в Telegram', error);
    return false;
  }
}
