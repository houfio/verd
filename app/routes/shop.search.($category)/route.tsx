import { useLoaderData, useSearchParams } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import styles from './route.module.css';

import categories from '~/data/categories.server.json';
import sorts from '~/data/sorts.server.json';
import { OptionList } from '~/routes/shop.search.($category)/OptionList';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const category = data?.category ? data.categories[data.category] : undefined;

  return [
    { title: `${category?.name ?? 'Search'} | Verd` }
  ];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const s = url.searchParams.get('s');
  let invalid = false;

  if (q === '') {
    invalid = true;
    url.searchParams.delete('q');
  }

  const sort = sorts.findIndex(({ slug }) => slug === (s ?? ''));

  if (s === '' || sort === -1) {
    invalid = true;
    url.searchParams.delete('s');
  }

  if (invalid) {
    return redirect(url.toString());
  }

  if (!params.category) {
    return json({
      category: -1,
      categories,
      sort,
      sorts
    });
  }

  const category = categories.findIndex(({ slug }) => slug === params.category);

  if (category === -1) {
    return redirect('/shop/search');
  }

  return json({
    category,
    categories,
    sort,
    sorts
  });
};

export default function Categories() {
  const { category, categories, sort, sorts } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const params = new URLSearchParams(searchParams);

  params.delete('q');

  return (
    <div className={styles.container}>
      <OptionList
        title="Categories"
        selected={category + 1}
        options={[
          {
            title: 'All',
            to: { pathname: '/shop/search', search: params.toString() }
          },
          ...categories.map((c) => ({
            title: c.name,
            to: { pathname: `/shop/search/${c.slug}`, search: params.toString() }
          }))
        ]}
      />
      <div className={styles.content}>
        {JSON.stringify(categories)}
        {category}
        {JSON.stringify(sorts)}
        {sort}
      </div>
      <OptionList
        title="Sort by"
        selected={sort}
        options={sorts.map((s) => {
          const params = new URLSearchParams(searchParams);

          params.set('s', s.slug);

          return {
            title: s.name,
            to: { search: params.toString() }
          };
        })}
      />
    </div>
  );
}
