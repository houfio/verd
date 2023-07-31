import type { Question as QuestionT } from '.prisma/client';
import { QuestionType, Survey } from '@prisma/client';
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
import { toOptions } from '~/utils/toOptions';

export const loader = async ({ params: { id } }: LoaderArgs) => {
  const surveys = Object.values(Survey);
  const questionTypes = Object.values(QuestionType);

  if (id === 'add') {
    return json({
      question: undefined as QuestionT | undefined,
      surveys,
      questionTypes
    });
  }

  const question = await db.question.findUnique({
    where: { id }
  });

  if (!question) {
    return redirect('/config/questions');
  }

  return json({
    question,
    surveys,
    questionTypes
  });
};

export const action = ({ request, params: { id } }: ActionArgs) => actions(request, {
  upsert: z.object({
    title: z.string().min(3),
    survey: z.nativeEnum(Survey),
    type: z.nativeEnum(QuestionType),
    data: z.string()
  })
}, {
  upsert: async ({ title, survey, type, data }) => {
    const obj = {
      title,
      survey,
      type,
      data: JSON.parse(data),
    };

    await db.question.upsert({
      where: { id },
      update: obj,
      create: {
        ...obj,
        order: await db.question.count({
          where: { survey }
        })
      }
    });

    return id === 'add' ? redirect('/config/questions') : 'Successfully updated question';
  }
});

export default function Question() {
  const { question, surveys, questionTypes } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();

  return (
    <>
      <ConfigHeader
        title={['Questions', question ? question.title : 'Add']}
        result={result}
      />
      <Form method="post">
        <input type="hidden" name="action" value="upsert"/>
        <Input name="title" label="Title" defaultValue={question?.title}/>
        <Select
          name="survey"
          label="Survey"
          values={toOptions(surveys)}
          defaultValue={question?.survey}
        />
        <Select
          name="type"
          label="Type"
          values={toOptions(questionTypes)}
          defaultValue={question?.type}
        />
        <Input name="data" label="Data" as="textarea" defaultValue={JSON.stringify((question as any)?.data)}/>
        <Button text={question ? 'Update' : 'Add'} type="submit"/>
      </Form>
    </>
  );
}
