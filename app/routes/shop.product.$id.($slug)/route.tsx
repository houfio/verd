import { useLoaderData } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';
import slugify from 'slugify';

import styles from './route.module.css';

import { Container } from '~/components/Container';
import { prisma } from '~/db.server';
import { Carousel } from '~/routes/shop.product.$id.($slug)/Carousel';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.product.brand} ${data?.product.name} | Verd Shop` }
  ];
};

export const loader = async ({ params: { id, slug } }: LoaderArgs) => {
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    return redirect('/shop');
  }

  const s = slugify(`${product.brand} ${product.name}`, {
    lower: true
  });

  if (s !== slug) {
    return redirect(`/shop/product/${product.id}/${s}`);
  }

  return json({ product });
};

export default function Product() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <Container className={styles.container}>
      <Carousel product={product}/>
      <div>
        <div>
          {product.brand}
        </div>
        <div>
          {product.name}
        </div>
      </div>
    </Container>
  );
}
