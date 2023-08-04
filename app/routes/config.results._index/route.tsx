import { faEye, faEyeSlash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs } from '@vercel/remix';
import { json } from '@vercel/remix';
import { format, parseISO } from 'date-fns';
import { z } from 'zod';

import styles from './route.module.css';

import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Table } from '~/components/config/Table';
import { db } from '~/db.server';
import { ExperimentCondition } from '~/utils/ExperimentCondition';
import { actions } from '~/utils/actions.server';

export const loader = async () => json({
  scenarios: await db.scenario.findMany(),
  results: await db.result.findMany({
    include: { products: true },
    orderBy: { date: 'asc' }
  })
});

export const action = ({ request }: ActionArgs) => actions(request, {
  exclude: z.object({
    id: z.string(),
    exclude: z.enum(['true', 'false']).transform((value) => value === 'true')
  })
}, {
  exclude: async ({ id, exclude }) => {
    await db.result.update({
      where: { id },
      data: { exclude }
    });

    return `Successfully ${exclude ? 'excluded' : 'included'} result`;
  }
});

export default function Scenarios() {
  const { results } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();

  return (
    <>
      <ConfigHeader
        title={['Results']}
        result={result}
        actions={[
          {
            icon: faFloppyDisk,
            to: '/config/results/export',
            download: `results_${format(new Date(), 'yyyy-MM-dd_HH-mm')}`
          }
        ]}
      />
      <div className={styles.stats}>
        <p>
          {results.length} participants
        </p>
        {Object.values(ExperimentCondition).filter((k) => typeof k === 'string').map((condition, i) => (
          <p key={i}>
            - {results.filter((r) => r.condition === i && !r.exclude).length} {condition.toString().toLowerCase()}
          </p>
        ))}
        <p>
          - {results.filter((r) => r.exclude).length} excluded
        </p>
      </div>
      <Table
        id={(result) => result.id}
        columns={{
          date: {
            label: 'Date',
            render: (date) => format(parseISO(date), 'yyyy-MM-dd HH:mm')
          },
          condition: {
            label: 'Condition',
            render: (condition) => {
              const label = ExperimentCondition[condition];

              return `${label[0]}${label.substring(1).toLowerCase()}`;
            }
          },
          id: {
            label: 'Actions',
            shrink: true,
            render: (id, { exclude }) => (
              <div id="actions">
                <Form method="post">
                  <input type="hidden" name="action" value="exclude"/>
                  <input type="hidden" name="id" value={id}/>
                  <input type="hidden" name="exclude" value={String(!exclude)}/>
                  <button type="submit">
                    <FontAwesomeIcon icon={exclude ? faEye : faEyeSlash}/>
                  </button>
                </Form>
              </div>
            )
          }
        }}
        rows={results}
        rowClassName={(result) => result.exclude ? styles.excluded : undefined}
      />
    </>
  );
}
