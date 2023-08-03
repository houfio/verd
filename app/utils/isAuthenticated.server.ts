export function isAuthenticated(request: Request) {
  const header = request.headers.get('Authorization');

  if (!header) {
    return false;
  }

  const base64 = header.replace('Basic ', '');
  const [username, password] = Buffer.from(base64, 'base64').toString().split(':');

  return username === process.env.CONFIG_USERNAME && password === process.env.CONFIG_PASSWORD;
}
