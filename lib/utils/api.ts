export function ok<T>(data: T, status = 200): Response {
  return Response.json(data, { status });
}

export function badRequest(message: string): Response {
  return Response.json({ error: message }, { status: 400 });
}

export function notFound(message: string): Response {
  return Response.json({ error: message }, { status: 404 });
}

export function internalError(message = 'Internal server error'): Response {
  return Response.json({ error: message }, { status: 500 });
}
