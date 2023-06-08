import { createCookieSessionStorage } from '@remix-run/node';

type SessionData = {
  message: string
};

type Message = {
  type: string,
  message: string
};

const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
});

function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');

  return sessionStorage.getSession(cookie);
}

export async function setMessage(request: Request, type: string, message: string) {
  const session = await getSession(request);

  session.flash('message', JSON.stringify({ type, message }));

  return {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session)
    }
  };
}

export async function getMessage(request: Request) {
  const session = await getSession(request);
  const message = session.has('message') ? JSON.parse(session.get('message')!) as Message : undefined;

  return {
    data: { message },
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session)
    }
  };
}
