export function csv(content: string, init: number | ResponseInit = {}) {
  const responseInit = typeof init === 'number' ? { status: init } : init;
  const headers = new Headers(responseInit.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'text/csv; charset=utf-8');
  }

  return new Response(content, {
    ...responseInit,
    headers
  });
}
