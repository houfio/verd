import type { Product as ProductType } from '@prisma/client';
import { Form, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Input } from '~/components/form/Input';
import { Select } from '~/components/form/Select';
import { prisma } from '~/db.server';
import { setMessage } from '~/session.server';

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

export const action = async ({ request, params: { id } }: ActionArgs) => {
  const data = await request.formData();
  const name = data.get('name');
  const brand = data.get('brand');
  const categoryId = data.get('categoryId');
  const price = data.get('price');
  const description = data.get('description');
  const images = data.getAll('image');

  if (!name || typeof name !== 'string' ||
    !brand || typeof brand !== 'string' ||
    !categoryId || typeof categoryId !== 'string' ||
    !price || typeof price !== 'string' ||
    !description || typeof description !== 'string') {
    return json({}, await setMessage(request, 'error', 'Invalid data'));
  }

  const priceFloat = Math.round(parseFloat(price) * 100) / 100;

  try {
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
          images: images.map((i) => String(i))
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
          images: images.map((i) => String(i))
        }
      });
    }
  } catch {
    return json({}, await setMessage(request, 'error', 'Already exists'));
  }

  return redirect('/config/products');
};

export default function Product() {
  const { product, categories } = useLoaderData<typeof loader>();

  return (
    <>
      <ConfigHeader
        title={['Products', product ? product.name : 'Add']}
      />
      <Form method="post">
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
          <Input key={i} name="image" label="Image" defaultValue={i}/>
        )) : (
          <Input name="image" label="Image"/>
        )}
        <button type="submit">
          {product ? 'Update' : 'Add'}
        </button>
      </Form>
    </>
  );
}
