import { useLoaderData, useSearchParams } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import styles from './route.module.css';

import { Container } from '~/components/Container';
import { OptionList } from '~/components/OptionList';
import { prisma } from '~/db.server';
import { ProductGrid } from '~/routes/shop.search.($category)/ProductGrid';

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

  const categories = await prisma.category.findMany();

  if (!params.category) {
    return json({
      sort,
      category: -1,
      categories,
      products: await prisma.product.findMany({
        where: { name: { contains: q } },
        orderBy: {
          price: s === 'price-asc' ? 'asc' : s === 'price-desc' ? 'desc' : undefined
        }
      })
    });
  }

  const category = categories.findIndex(({ slug }) => slug === params.category);

  if (category === -1) {
    return redirect('/shop/search');
  }

  return json({
    sort,
    category,
    categories,
    products: await prisma.product.findMany({
      where: { category: { slug: params.category } },
      orderBy: {
        price: s === 'price-asc' ? 'asc' : s === 'price-desc' ? 'desc' : undefined
      }
    })
  });
};

export const sorts = [
  {
    name: 'Relevance',
    slug: ''
  },
  {
    name: 'Price: Low to High',
    slug: 'price-asc'
  },
  {
    name: 'Price: High to Low',
    slug: 'price-desc'
  }
];

export default function Categories() {
  const { sort, category, categories, products } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const params = new URLSearchParams(searchParams);

  params.delete('q');

  return (
    <Container className={styles.container}>
      <OptionList
        title="Categories"
        active={category + 1}
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
      <ProductGrid products={products}/>
      <OptionList
        title="Sort by"
        active={sort}
        options={sorts.map((s) => {
          const params = new URLSearchParams(searchParams);

          params.set('s', s.slug);

          return {
            title: s.name,
            to: { search: params.toString() }
          };
        })}
      />
    </Container>
  );
}
