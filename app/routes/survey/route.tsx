import type { Question, QuestionType } from '@prisma/client';
import { Survey as SurveyKind } from '@prisma/client';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';
import type { ComponentType } from 'react';
import { createElement } from 'react';

import styles from './route.module.css';

import { Container } from '~/components/Container';
import { Message } from '~/components/config/Message';
import { Button } from '~/components/form/Button';
import { db } from '~/db.server';
import { OpenQuestion } from '~/routes/survey/question/OpenQuestion';
import { ScaleQuestion } from '~/routes/survey/question/ScaleQuestion';
import { SelectQuestion } from '~/routes/survey/question/SelectQuestion';
import { getAnswers, getCondition, getConsent, getProducts, setAnswers } from '~/session.server';
import { actions } from '~/utils/actions.server';
import { getSurveyKind } from '~/utils/getSurveyKind.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd Survey' }
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const consent = await getConsent(request);
  const kind = getSurveyKind(request);

  if (!consent || !kind) {
    return redirect('/');
  }

  const questions = await db.question.findMany({
    where: { survey: kind },
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
    const kind = getSurveyKind(request);
    const totalQuestions = await db.question.count();
    const questions = await db.question.findMany({
      where: { survey: kind }
    });

    for (const question of questions) {
      if (!(question.id in data)) {
        throw 'Please answer all questions';
      }
    }

    const { done, answers, headers } = await setAnswers(request, data, totalQuestions);

    if (done) {
      const products = await getProducts(request);
      const scenarios = await db.scenario.findMany();

      await db.result.create({
        data: {
          condition: (await getCondition(request)) ?? -1,
          answers: {
            create: Object.entries(answers).map(([questionId, answer]) => ({
              questionId,
              answer
            }))
          },
          products: {
            create: products.map((productId, i) => ({
              productId,
              scenarioId: scenarios[i].id
            }))
          }
        }
      });
    }

    return redirect(kind === SurveyKind.PRE ? '/shop' : '/', { headers });
  }
});

const types: Record<QuestionType, ComponentType<{ question: Question }>> = {
  SELECT: SelectQuestion,
  SCALE: ScaleQuestion,
  OPEN: OpenQuestion
};

export default function Survey() {
  const { questions, answers } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();

  return (
    <Container className={styles.container}>
      <div className={styles.header}>
        <img src="/logo.png" alt="Verd logo" className={styles.logo}/>
        Survey
      </div>
      {result?.[0] === false && (
        <Message message={{ type: 'error', message: result[2][0].message }}/>
      )}
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
