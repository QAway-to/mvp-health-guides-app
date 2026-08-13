export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * Сравнение секретов за постоянное время.
 *
 * Обычное `a === b` выходит из цикла на первом несовпавшем байте, и по
 * времени ответа секрет подбирается посимвольно. Разница в длине здесь не
 * скрывается — она и так видна, а вот содержимое скрыть нужно.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Не задан секрет ${name}`);
  }
  return value;
}
