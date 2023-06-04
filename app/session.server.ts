import { createCookieSessionStorage } from '@remix-run/node';

type SessionData = {
  products: number[]
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
