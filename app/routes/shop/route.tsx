import { Outlet } from '@remix-run/react';
import type { V2_MetaFunction } from '@vercel/remix';

import { Navigation } from '~/routes/shop/Navigation';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd' }
  ];
};

export default function Shop() {
  return (
    <div>
      <Navigation/>
      <Outlet/>
    </div>
  );
}
