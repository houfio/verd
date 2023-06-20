import type { Question, QuestionType } from '@prisma/client';
import { Survey as SurveyKind } from '@prisma/client';
import { Form, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';
import type { ComponentType } from 'react';
import { createElement } from 'react';

import styles from './route.module.css';

import { Container } from '~/components/Container';
import { Button } from '~/components/form/Button';
import { prisma } from '~/db.server';
import { OpenQuestion } from '~/routes/survey/question/OpenQuestion';
import { ScaleQuestion } from '~/routes/survey/question/ScaleQuestion';
import { SelectQuestion } from '~/routes/survey/question/SelectQuestion';
import { getAnswers, getConsent, setAnswers } from '~/session.server';
import { actions } from '~/utils/actions.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd Survey' }
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const consent = await getConsent(request);
  const url = new URL(request.url);
  const k = url.searchParams.get('k')?.toUpperCase();

  if (!consent || !k || !(k in SurveyKind)) {
    return redirect('/');
  }

  const questions = await prisma.question.findMany({
    where: { survey: k as SurveyKind },
    orderBy: { order: 'asc' }
  });
  const answers = await getAnswers(request);

  return json({
    questions,
    answers
  });
};

export const action = ({ request }: ActionArgs) => actions(request, {
  submit: null
}, {
  submit: async (data) => {
    const headers = await setAnswers(request, data);

    return redirect('/shop', { headers });
  }
});

const types: Record<QuestionType, ComponentType<{ question: Question }>> = {
  SELECT: SelectQuestion,
  SCALE: ScaleQuestion,
  OPEN: OpenQuestion
};

export default function Survey() {
  const { questions, answers } = useLoaderData<typeof loader>();

  return (
    <Container className={styles.container}>
      <Form method="post">
        <input type="hidden" name="action" value="submit"/>
        {questions.map((question) => createElement(types[question.type], {
          key: question.id,
          question,
          answer: answers[question.id]
        } as any))}
        <Button text="Continue" type="submit"/>
      </Form>
    </Container>
  );
}
