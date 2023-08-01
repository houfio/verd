import { createCookieSessionStorage } from '@remix-run/node';

import { ExperimentCondition } from '~/utils/ExperimentCondition';
import { randomEnum } from '~/utils/randomEnum.server';

type SessionData = {
  consent: string,
  answers: string,
  condition: string,
  products: string,
  done: string,
  extras: string
};

const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 31_556_952, // one year
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET ?? ''],
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

export async function setAnswers(request: Request, data: Record<string, string>, total: number) {
  const session = await getSession(request);
  const answers = await getAnswers(request);
  const object = Object.assign(answers, data);

  session.set('answers', JSON.stringify(object));

  if (!session.has('condition')) {
    session.set('condition', randomEnum(ExperimentCondition).toString());
  }

  let done = false;

  if (Object.keys(object).length === total) {
    done = true;
    session.set('done', 'true');
  }

  return {
    done,
    answers: object,
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session)
    }
  };
}

export async function getCondition(request: Request) {
  const session = await getSession(request);

  if (!session.has('condition')) {
    return;
  }

  const condition = session.get('condition');

  return Number(condition) as ExperimentCondition;
}

export async function getProducts(request: Request) {
  const session = await getSession(request);

  return JSON.parse(session.get('products') ?? '[]') as string[];
}

export async function addProduct(request: Request, product: string) {
  const session = await getSession(request);
  const products = await getProducts(request);

  session.set('products', JSON.stringify([...products, product]));

  return {
    'Set-Cookie': await sessionStorage.commitSession(session)
  };
}

export async function isDone(request: Request) {
  const session = await getSession(request);

  return session.get('done') === 'true';
}

export async function addExtra(request: Request, extra: string) {
  const session = await getSession(request);
  const extras = JSON.parse(session.get('extras') ?? '[]');

  if (!extras.includes(extra)) {
    session.set('extras', JSON.stringify([...extras, extra]));
  }

  return {
    'Set-Cookie': await sessionStorage.commitSession(session)
  };
}

export async function hasExtra(request: Request, extra: string) {
  const session = await getSession(request);
  const extras = JSON.parse(session.get('extras') ?? '[]');

  return extras.includes(extra);
}
