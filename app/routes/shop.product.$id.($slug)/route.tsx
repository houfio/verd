import { Form, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';
import { useState } from 'react';
import slugify from 'slugify';

import styles from './route.module.css';

import { Container } from '~/components/Container';
import { Modal } from '~/components/Modal';
import { Button } from '~/components/form/Button';
import { db } from '~/db.server';
import { useShopData } from '~/hooks/useShopData';
import { Carousel } from '~/routes/shop.product.$id.($slug)/Carousel';
import { addProduct } from '~/session.server';
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
    const headers = await addProduct(request, id as string);

    return redirect('/shop', { headers });
  }
});

export default function Product() {
  const { scenario } = useShopData();
  const { product } = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);

  return (
    <Container>
      <div className={styles.container}>
        <div className={styles.details}>
          <div className={styles.title}>
            <span>
              {product.brand}
            </span>
            <span>
              {product.name}
            </span>
            <span>
              £{product.price.toFixed(2)}
            </span>
          </div>
          <Button text="Select product" onClick={() => setOpen(true)}/>
        </div>
        <Carousel product={product}/>
      </div>
      <div className={styles.description}>
        <div className={styles.header}>
          {product.name}
        </div>
        <div>
          {product.description}
        </div>
      </div>
      <Modal title="Select product" open={open} onClose={() => setOpen(false)}>
        Do you want to select this product for the following scenario?
        <div className={styles.box}>
          {scenario.text}
        </div>
        <div id="actions">
          <Button text="Cancel" white={true} onClick={() => setOpen(false)}/>
          <Form method="post">
            <input type="hidden" name="action" value="basket"/>
            <Button text="Proceed"/>
          </Form>
        </div>
      </Modal>
    </Container>
  );
}
