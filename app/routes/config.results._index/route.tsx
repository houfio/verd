import { faFloppyDisk, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs } from '@vercel/remix';
import { json } from '@vercel/remix';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import styles from './route.module.css';

import { Modal } from '~/components/Modal';
import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Table } from '~/components/config/Table';
import { Button } from '~/components/form/Button';
import { db } from '~/db.server';
import { ExperimentCondition } from '~/utils/ExperimentCondition';
import { actions } from '~/utils/actions.server';

export const loader = async () => json({
  results: await db.result.findMany()
});

export const action = ({ request }: ActionArgs) => actions(request, {
  delete: z.object({
    id: z.string()
  })
}, {
  delete: async ({ id }) => {
    await db.$transaction([
      db.selectedProduct.deleteMany({
        where: {
          result: { id }
        }
      }),
      db.answer.deleteMany({
        where: {
          result: { id }
        }
      }),
      db.result.delete({
        where: { id }
      })
    ]);

    return 'Successfully deleted result';
  }
});

export default function Scenarios() {
  const { results } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const [open, setOpen] = useState(false);
  const [remove, setRemove] = useState<string>();

  useEffect(() => {
    setOpen(false);
  }, [result]);

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
            - {results.filter((r) => r.condition === i).length} {condition.toString().toLowerCase()}
          </p>
        ))}
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
            render: (condition) => condition ? 'Experimental' : 'Control'
          },
          id: {
            label: 'Actions',
            shrink: true,
            render: (id) => (
              <div id="actions">
                <button
                  onClick={() => {
                    setRemove(id);
                    setOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash}/>
                </button>
              </div>
            )
          }
        }}
        rows={results}
      />
      <Modal title="Delete" open={open} onClose={() => setOpen(false)}>
        Are you sure you want to delete this scenario?
        <div id="actions">
          <Button text="Cancel" white={true} onClick={() => setOpen(false)}/>
          <Form method="post">
            <input type="hidden" name="action" value="delete"/>
            <input type="hidden" name="id" value={remove}/>
            <Button text="Delete" type="submit"/>
          </Form>
        </div>
      </Modal>
    </>
  );
}
