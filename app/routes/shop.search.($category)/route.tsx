import { useLoaderData, useSearchParams } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import styles from './route.module.css';

import categories from '~/data/categories.server.json';
import sorts from '~/data/sorts.server.json';
import { OptionList } from '~/routes/shop.search.($category)/OptionList';
import { ProductGrid } from '~/routes/shop.search.($category)/ProductGrid';
import { getProducts } from '~/utils/getProducts.server';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const category = (data?.category ?? -1) > -1 ? data?.categories[data.category] : undefined;

  return [
    { title: `${category?.name ?? 'Search'} | Verd Shop` }
  ];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') ?? undefined;
  const s = url.searchParams.get('s') ?? undefined;
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
      sorts,
      products: getProducts(q, s),
      search: q
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
    sorts,
    products: getProducts(categories[category].id, s),
    search: undefined
  });
};

export default function Categories() {
  const { category, categories, sort, sorts, products, search } = useLoaderData<typeof loader>();
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
      <ProductGrid search={search} products={products}/>
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
