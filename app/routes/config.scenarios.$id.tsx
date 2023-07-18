import type { Scenario as ScenarioType } from '@prisma/client';
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
    return json({ scenario: undefined as ScenarioType | undefined });
  }

  const scenario = await db.scenario.findUnique({
    where: { id }
  });

  if (!scenario) {
    return redirect('/config/scenarios');
  }

  return json({ scenario });
};

export const action = ({ request, params: { id } }: ActionArgs) => actions(request, {
  upsert: z.object({
    name: z.string().min(1),
    text: z.string().min(1)
  })
}, {
  upsert: async ({ name, text }) => {
    const data = { name, text };

    await db.scenario.upsert({
      where: { id },
      update: data,
      create: data
    });

    return id === 'add' ? redirect('/config/scenarios') : 'Successfully updated scenario';
  }
});

export default function Scenario() {
  const { scenario } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();

  return (
    <>
      <ConfigHeader
        title={['Scenarios', scenario ? scenario.name : 'Add']}
        result={result}
      />
      <Form method="post">
        <input type="hidden" name="action" value="upsert"/>
        <Input name="name" label="Name" defaultValue={scenario?.name}/>
        <Input name="text" label="Text" as="textarea" defaultValue={scenario?.text}/>
        <Button text={scenario ? 'Update' : 'Add'} type="submit"/>
      </Form>
    </>
  );
}
