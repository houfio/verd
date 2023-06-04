import { config } from '@fortawesome/fontawesome-svg-core';
import fontawesome from '@fortawesome/fontawesome-svg-core/styles.css';
import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

import styles from './root.css';

import { Navigation } from '~/components/Navigation';

config.autoAddCss = false;

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap'
  },
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: fontawesome },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : [])
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <Meta/>
        <Links/>
      </head>
      <body>
        <Navigation/>
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
      </body>
    </html>
  );
}
