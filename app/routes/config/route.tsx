import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json } from '@vercel/remix';

import styles from './route.module.css';

import { Footer } from '~/components/Footer';
import { OptionList } from '~/components/OptionList';
import { Message } from '~/routes/config/Message';
import { getMessage } from '~/session.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd Config' }
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const { data, headers } = await getMessage(request);

  return json(data, { headers });
};

export default function Config() {
  const { message } = useLoaderData<typeof loader>();

  return (
    <>
      <main className={styles.page}>
        <OptionList
          title="Config"
          options={[
            {
              title: 'Products',
              to: '/config/products'
            },
            {
              title: 'Categories',
              to: '/config/categories'
            }
          ]}
        />
        <div className={styles.outlet}>
          {message && (
            <Message message={message}/>
          )}
          <Outlet/>
        </div>
      </main>
      <Footer title="Config"/>
    </>
  );
}
