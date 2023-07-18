import type { Product as ProductType } from '@prisma/client';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';
import { z } from 'zod';

import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Button } from '~/components/form/Button';
import { Input } from '~/components/form/Input';
import { Select } from '~/components/form/Select';
import { db } from '~/db.server';
import { actions } from '~/utils/actions.server';

export const loader = async ({ params: { id } }: LoaderArgs) => {
  const categories = await db.category.findMany();
  const scenarios = await db.scenario.findMany();

  if (id === 'add') {
    return json({
      product: undefined as ProductType | undefined,
      categories,
      scenarios
    });
  }

  const product = await db.product.findUnique({
    where: { id }
  });

  if (!product) {
    return redirect('/config/products');
  }

  return json({ product, categories, scenarios });
};

export const action = ({ request, params: { id } }: ActionArgs) => actions(request, {
  upsert: z.object({
    name: z.string().min(3),
    brand: z.string().min(3),
    categoryId: z.string(),
    scenarioId: z.string().optional(),
    price: z.coerce.number(),
    description: z.string(),
    images: z.string().array().nonempty()
  })
}, {
  upsert: async ({ name, brand, categoryId, scenarioId, price, description, images }) => {
    const data = {
      name,
      brand,
      category: {
        connect: { id: categoryId }
      },
      price: Math.round(price * 100) / 100,
      description,
      images
    };

    await db.product.upsert({
      where: { id },
      update: {
        ...data,
        scenario: scenarioId ? {
          connect: { id: scenarioId }
        } : {
          disconnect: true
        },
      },
      create: { 
        ...data,
        scenario: scenarioId ? {
          connect: { id: scenarioId }
        } : undefined
      }
    });

    return id === 'add' ? redirect('/config/products') : 'Successfully updated product';
  }
});

export default function Product() {
  const { product, categories, scenarios } = useLoaderData<typeof loader>();
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
        <Select
          name="scenarioId"
          label="Scenario"
          values={scenarios.map((c) => ({ key: c.id, value: c.name }))}
          defaultValue={product?.scenarioId}
          nullable={true}
        />
        <Input name="price" label="Price" type="number" step="0.01" defaultValue={product?.price}/>
        <Input name="description" label="Description" as="textarea" defaultValue={product?.description}/>
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
