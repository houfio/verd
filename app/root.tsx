import { config } from '@fortawesome/fontawesome-svg-core';
import fontawesome from '@fortawesome/fontawesome-svg-core/styles.css';
import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { Analytics } from '@vercel/analytics/react';
import { json } from '@vercel/remix';

import styles from './root.css';

config.autoAddCss = false;

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap'
  },
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: fontawesome },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : [])
];

export const loader = async () => json({
  version: (process.env.VERCEL_GIT_COMMIT_SHA ?? 'develop').substring(0, 7)
});

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <Meta/>
        <Links/>
      </head>
      <body>
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        <Analytics/>
      </body>
    </html>
  );
}
