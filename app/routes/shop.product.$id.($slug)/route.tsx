import { Form, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';
import slugify from 'slugify';

import styles from './route.module.css';

import { Container } from '~/components/Container';
import { Button } from '~/components/form/Button';
import { db } from '~/db.server';
import { useMatchesData } from '~/hooks/useMatchesData';
import { Carousel } from '~/routes/shop.product.$id.($slug)/Carousel';
import { toggleProduct } from '~/session.server';
import { actions } from '~/utils/actions.server';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.product.brand} ${data?.product.name} | Verd Shop` }
  ];
};

export const loader = async ({ params: { id, slug } }: LoaderArgs) => {
  const product = await db.product.findUnique({
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

export const action = ({ request, params: { id } }: ActionArgs) => actions(request, {
  basket: null
}, {
  basket: async () => {
    const headers = await toggleProduct(request, id as string);

    return new Response(undefined, { headers });
  }
});

export default function Product() {
  const { product } = useLoaderData<typeof loader>();
  const data = useMatchesData<{ products: string[] }>('routes/shop');
  const basket = data?.products.indexOf(product.id) !== -1;

  return (
    <Container>
      <div className={styles.container}>
        <Carousel product={product}/>
        <div>
          <div>
            {product.brand}
          </div>
          <div>
            {product.name}
          </div>
          <Form method="post">
            <input type="hidden" name="action" value="basket"/>
            <Button text={basket ? 'Remove from basket' : 'Add to basket'}/>
          </Form>
        </div>
      </div>
      <div>
        <div>
          {product.name}
        </div>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {product.description}
        </div>
      </div>
    </Container>
  );
}
