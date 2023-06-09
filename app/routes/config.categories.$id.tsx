import type { Category as CategoryType } from '@prisma/client';
import { Form, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Button } from '~/components/form/Button';
import { Input } from '~/components/form/Input';
import { prisma } from '~/db.server';
import { setMessage } from '~/session.server';

export const loader = async ({ params: { id } }: LoaderArgs) => {
  if (id === 'add') {
    return json({ category: undefined as CategoryType | undefined });
  }

  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    return redirect('/config/categories');
  }

  return json({ category });
};

export const action = async ({ request, params: { id } }: ActionArgs) => {
  const data = await request.formData();
  const name = data.get('name');
  const slug = data.get('slug');

  if (!name || typeof name !== 'string' || !slug || typeof slug !== 'string') {
    return json({}, await setMessage(request, 'error', 'Invalid data'));
  }

  try {
    if (id === 'add') {
      await prisma.category.create({
        data: { name, slug }
      });
    } else {
      await prisma.category.update({
        where: { id },
        data: { name, slug }
      });
    }
  } catch {
    return json({}, await setMessage(request, 'error', 'Already exists'));
  }

  return redirect('/config/categories');
};

export default function Category() {
  const { category } = useLoaderData<typeof loader>();

  return (
    <>
      <ConfigHeader
        title={['Categories', category ? category.name : 'Add']}
      />
      <Form method="post">
        <Input name="name" label="Name" defaultValue={category?.name}/>
        <Input name="slug" label="Slug" defaultValue={category?.slug}/>
        <Button text={category ? 'Update' : 'Add'} type="submit"/>
      </Form>
    </>
  );
}
