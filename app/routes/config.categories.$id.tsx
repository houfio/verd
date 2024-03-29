import type { Category as CategoryType } from '@prisma/client';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';
import { z } from 'zod';

import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Button } from '~/components/form/Button';
import { Input } from '~/components/form/Input';
import { db } from '~/db.server';
import { actions } from '~/utils/actions.server';

export const loader = async ({ params: { id } }: LoaderArgs) => {
  if (id === 'add') {
    return json({ category: undefined as CategoryType | undefined });
  }

  const category = await db.category.findUnique({
    where: { id }
  });

  if (!category) {
    return redirect('/config/categories');
  }

  return json({ category });
};

export const action = ({ request, params: { id } }: ActionArgs) => actions(request, {
  upsert: z.object({
    name: z.string(),
    slug: z.string()
  })
}, {
  upsert: async ({ name, slug }) => {
    const data = { name, slug };

    await db.category.upsert({
      where: { id },
      update: data,
      create: data
    });

    return id === 'add' ? redirect('/config/categories') : 'Successfully updated category';
  }
});

export default function Category() {
  const { category } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();

  return (
    <>
      <ConfigHeader
        title={['Categories', category ? category.name : 'Add']}
        result={result}
      />
      <Form method="post">
        <input type="hidden" name="action" value="upsert"/>
        <Input name="name" label="Name" defaultValue={category?.name}/>
        <Input name="slug" label="Slug" defaultValue={category?.slug}/>
        <Button text={category ? 'Update' : 'Add'} type="submit"/>
      </Form>
    </>
  );
}
