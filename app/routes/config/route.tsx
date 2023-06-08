import { Outlet } from '@remix-run/react';
import type { V2_MetaFunction } from '@vercel/remix';

import styles from './route.module.css';

import { Footer } from '~/components/Footer';
import { OptionList } from '~/components/OptionList';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd Config' }
  ];
};

export default function Config() {
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
        <Outlet/>
      </main>
      <Footer title="Config"/>
    </>
  );
}
