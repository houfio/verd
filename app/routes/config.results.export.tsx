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

  const url = new URL(request.url);
  const coded = url.searchParams.has('c');

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

  const mapped = results
    .filter((result) => !coded || !result.exclude)
    .map((result) => {
      const answers = questions.reduce((previous, current) => {
        let answer = result.answers.find((a) => a.questionId === current.id)?.answer ?? '';

        if (current.data && typeof current.data === 'object') {
          if ('omit' in current.data && current.data.omit) {
            return previous;
          }

          if ('options' in current.data) {
            const options = current.data.options as string[];
            let index = Number(answer);

            if (coded && isNaN(index)) {
              index = options.indexOf(answer);

              if (index > -1 && 'reverse' in current.data && current.data.reverse) {
                index = options.length - index - 1;
              }

              answer = String(index);
            }

            if (!coded && 'mapped' in current.data && current.data.mapped) {
              if (!isNaN(index)) {
                if (index === -1) {
                  answer = 'Prefer not to say';
                } else {
                  answer = options[index];
                }
              }
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

        if (coded) {
          const count = 'sustainable' in previous ? previous['sustainable'] as number : 0;

          return {
            'sustainable': count + (selected?.product.scenarioId === current.id && selected?.product.label ? 1 : 0)
          };
        }

        return {
          ...previous,
          [`${name}Satisfied`]: selected?.product.scenarioId === current.id,
          [`${name}Sustainable`]: selected?.product.label !== null
        };
      }, {});

      return {
        date: result.date,
        condition: result.condition,
        ...coded ? {} : {
          exclude: result.exclude
        },
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
