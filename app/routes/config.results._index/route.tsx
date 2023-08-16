import {
  faCircle,
  faCircleCheck,
  faCircleXmark,
  faEye,
  faEyeSlash, faFileCode,
  faFloppyDisk,
  faNoteSticky
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs } from '@vercel/remix';
import { json } from '@vercel/remix';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { z } from 'zod';

import styles from './route.module.css';

import { Modal } from '~/components/Modal';
import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Table } from '~/components/config/Table';
import { db } from '~/db.server';
import { ExperimentCondition } from '~/utils/ExperimentCondition';
import { actions } from '~/utils/actions.server';

export const loader = async () => json({
  results: await db.result.findMany({
    include: {
      products: {
        include: {
          product: {
            select: {
              scenarioId: true,
              label: true
            }
          }
        }
      },
      answers: {
        where: {
          answer: {
            not: ''
          },
          question: {
            name: 'note'
          }
        }
      }
    },
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
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string>();

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
          },
          {
            icon: faFileCode,
            to: '/config/results/export?c',
            download: `results_${format(new Date(), 'yyyy-MM-dd_HH-mm')}_coded`
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
          products: {
            label: 'Results',
            render: (products) => (
              <div>
                {products.map((product) => (
                  <FontAwesomeIcon
                    key={product.scenarioId}
                    icon={product.product.scenarioId === product.scenarioId ? product.product.label ? faCircleCheck : faCircle : faCircleXmark}
                    fixedWidth={true}
                  />
                ))}
              </div>
            )
          },
          id: {
            label: 'Actions',
            shrink: true,
            render: (id, { answers, exclude }) => (
              <div id="actions">
                {answers.length > 0 && (
                  <button
                    onClick={() => {
                      setNote(answers[0].answer);
                      setOpen(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faNoteSticky}/>
                  </button>
                )}
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
      <Modal title="Note" open={open} onClose={() => setOpen(false)}>
        {note}
      </Modal>
    </>
  );
}
