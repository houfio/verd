import type { Product as ProductType } from '@prisma/client';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';
import { z } from 'zod';

import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Button } from '~/components/form/Button';
import { Input } from '~/components/form/Input';
import { Select } from '~/components/form/Select';
import { prisma } from '~/db.server';
import { actions } from '~/utils/actions.server';

export const loader = async ({ params: { id } }: LoaderArgs) => {
  const categories = await prisma.category.findMany();

  if (id === 'add') {
    return json({
      product: undefined as ProductType | undefined,
      categories
    });
  }

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    return redirect('/config/products');
  }

  return json({ product, categories });
};

export const action = ({ request, params: { id } }: ActionArgs) => actions(request, {
  upsert: z.object({
    name: z.string().min(3),
    brand: z.string().min(3),
    categoryId: z.string(),
    price: z.coerce.number(),
    description: z.string(),
    images: z.string().array().nonempty()
  })
}, {
  upsert: async ({ name, brand, categoryId, price, description, images }) => {
    const priceFloat = Math.round(price * 100) / 100;

    if (id === 'add') {
      await prisma.product.create({
        data: {
          name,
          brand,
          category: {
            connect: { id: categoryId }
          },
          price: priceFloat,
          description,
          images
        }
      });
    } else {
      await prisma.product.update({
        where: { id },
        data: {
          name,
          brand,
          category: {
            connect: { id: categoryId }
          },
          price: priceFloat,
          description,
          images
        }
      });
    }

    return redirect('/config/products');
  }
});

export default function Product() {
  const { product, categories } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();

  return (
    <>
      <ConfigHeader
        title={['Products', product ? product.name : 'Add']}
        result={result}
      />
      <Form method="post">
        <input type="hidden" name="action" value="upsert"/>
        <Input name="name" label="Name" defaultValue={product?.name}/>
        <Input name="brand" label="Brand" defaultValue={product?.brand}/>
        <Select
          name="categoryId"
          label="Category"
          values={categories.map((c) => ({ key: c.id, value: c.name }))}
          defaultValue={product?.categoryId}
        />
        <Input name="price" label="Price" type="number" step="0.01" defaultValue={product?.price}/>
        <Input name="description" label="Description" defaultValue={product?.description}/>
        {product ? product.images.map((i) => (
          <Input key={i} name="images[]" label="Image" defaultValue={i}/>
        )) : (
          <Input name="images[]" label="Image"/>
        )}
        <Button text={product ? 'Update' : 'Add'} type="submit"/>
      </Form>
    </>
  );
}
