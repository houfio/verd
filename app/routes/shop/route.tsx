import { Outlet } from '@remix-run/react';
import type { V2_MetaFunction } from '@vercel/remix';

import { Footer } from '~/routes/shop/Footer';
import { Navigation } from '~/routes/shop/Navigation';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd Shop' }
  ];
};

export default function Shop() {
  return (
    <div>
      <Navigation/>
      <Outlet/>
      <Footer/>
    </div>
  );
}
