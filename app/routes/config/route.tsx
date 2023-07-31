import { Outlet, useLoaderData } from '@remix-run/react';
import type { HeadersFunction, LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json } from '@vercel/remix';

import styles from './route.module.css';

import { Container } from '~/components/Container';
import { Footer } from '~/components/Footer';
import { OptionList } from '~/components/OptionList';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd Config' }
  ];
};

export const headers: HeadersFunction = () => ({
  'WWW-Authenticate': 'Basic'
});

export const loader = ({ request }: LoaderArgs) => {
  const header = request.headers.get('Authorization');

  if (header) {
    const base64 = header.replace('Basic ', '');
    const [username, password] = Buffer.from(base64, 'base64').toString().split(':');

    if (username === process.env.CONFIG_USERNAME && password === process.env.CONFIG_PASSWORD) {
      return json({ authorized: true });
    }
  }

  return json({ authorized: false }, { status: 401 });
};

export default function Config() {
  const { authorized } = useLoaderData<typeof loader>();

  if (!authorized) {
    return (
      <>
        Unauthorized
      </>
    );
  }

  return (
    <>
      <Container as="main" className={styles.page}>
        <OptionList
          title="Config"
          options={[
            {
              title: 'Questions',
              to: '/config/questions'
            },
            {
              title: 'Products',
              to: '/config/products'
            },
            {
              title: 'Categories',
              to: '/config/categories'
            },
            {
              title: 'Scenarios',
              to: '/config/scenarios'
            }
          ]}
        />
        <div className={styles.outlet}>
          <Outlet/>
        </div>
      </Container>
      <Footer title="Config"/>
    </>
  );
}
