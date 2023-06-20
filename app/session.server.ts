import { createCookieSessionStorage } from '@remix-run/node';

type SessionData = {
  consent: string,
  answers: string
};

const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production'
  }
});

function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');

  return sessionStorage.getSession(cookie);
}

export async function getConsent(request: Request) {
  const session = await getSession(request);

  return session.get('consent') === 'true';
}

export async function giveConsent(request: Request) {
  const session = await getSession(request);

  session.set('consent', 'true');

  return {
    'Set-Cookie': await sessionStorage.commitSession(session)
  };
}

export async function getAnswers(request: Request) {
  const session = await getSession(request);

  return JSON.parse(session.get('answers') ?? '{}') as Record<string, string>;
}

export async function setAnswers(request: Request, data: Record<string, string>) {
  const session = await getSession(request);
  const answers = await getAnswers(request);

  session.set('answers', JSON.stringify(Object.assign(answers, data)));

  return {
    'Set-Cookie': await sessionStorage.commitSession(session)
  };
}
