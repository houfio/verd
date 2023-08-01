import { useLoaderData } from '@remix-run/react';

import { db } from '~/db.server';
import { csv } from '~/utils/csv.server';

export const loader = async () => {
  const questions = await db.question.findMany();
  const scenarios = await db.scenario.findMany();
  const results = await db.result.findMany({
    include: {
      answers: true,
      products: {
        include: {
          product: true
        }
      }
    }
  });

  const mapped = results.map((result) => {
    const answers = questions.reduce((previous, current) => {
      const answer = result.answers.find((a) => a.questionId === current.id);

      return {
        ...previous,
        [current.name]: `"${encodeURIComponent(answer?.answer ?? '')}"`
      };
    }, {});

    const products = scenarios.reduce((previous, current) => {
      const selected = result.products.find((p) => p.scenarioId === current.id);
      const name = current.name.toLowerCase();

      return {
        ...previous,
        [`${name}Satisfied`]: selected?.product.scenarioId === current.id,
        [`${name}Sustainable`]: selected?.product.label !== null
      };
    }, {});

    return {
      date: result.date,
      condition: result.condition,
      ...answers,
      ...products
    };
  });

  const data = [
    Object.keys(mapped[0]),
    ...mapped.map((m) => Object.values(m))
  ].join('\n');

  return csv(data);
};
