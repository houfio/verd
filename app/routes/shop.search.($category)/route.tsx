import { useLoaderData } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import categories from '~/data/categories.json';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.category?.name ?? 'Search'} | Verd` }
  ];
};

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.category) {
    return json({
      category: null
    });
  }

  const category = categories.find(({ slug }) => slug === params.category);

  if (!category) {
    return redirect('/shop/search');
  }

  return json({
    category
  });
};

export default function Categories() {
  const { category } = useLoaderData<typeof loader>();

  return (
    <div>
      {JSON.stringify(category)}
    </div>
  );
}
