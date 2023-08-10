import type { LoaderArgs } from '@vercel/remix';
import { json } from '@vercel/remix';
import { stringify } from 'csv-stringify/sync';

import { db } from '~/db.server';
import { csv } from '~/utils/csv.server';
import { isAuthenticated } from '~/utils/isAuthenticated.server';

export const loader = async ({ request }: LoaderArgs) => {
  if (!isAuthenticated(request)) {
    return json({ authorized: false }, { status: 401 });
  }

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
    },
    orderBy: { date: 'asc' }
  });

  const mapped = results.map((result) => {
    const answers = questions.reduce((previous, current) => {
      let answer = result.answers.find((a) => a.questionId === current.id)?.answer ?? '';

      if (current.data && typeof current.data === 'object' && 'mapped' in current.data && current.data.mapped && 'options' in current.data) {
        const index = Number(answer);

        if (!isNaN(index)) {
          if (index === -1) {
            answer = 'Prefer not to say';
          } else {
            answer = (current.data.options as string[])[index];
          }
        }
      }

      return {
        ...previous,
        [current.name]: answer
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
      exclude: result.exclude,
      ...answers,
      ...products
    };
  });

  return csv(stringify(mapped, {
    header: true,
    cast: {
      boolean: (v) => v ? '1' : '0'
    }
  }));
};
