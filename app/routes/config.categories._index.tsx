import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs } from '@vercel/remix';
import { json } from '@vercel/remix';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { Modal } from '~/components/Modal';
import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Table } from '~/components/config/Table';
import { Button } from '~/components/form/Button';
import { db } from '~/db.server';
import { actions } from '~/utils/actions.server';

export const loader = async () => json({
  categories: await db.category.findMany({
    include: {
      _count: true
    }
  })
});

export const action = ({ request }: ActionArgs) => actions(request, {
  delete: z.object({
    id: z.string()
  })
}, {
  delete: async ({ id }) => {
    await db.category.delete({
      where: { id }
    });

    return 'Successfully deleted category';
  }
});

export default function Categories() {
  const { categories } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const [open, setOpen] = useState(false);
  const [remove, setRemove] = useState<string>();

  useEffect(() => {
    setOpen(false);
  }, [result]);

  return (
    <>
      <ConfigHeader
        title={['Categories']}
        actions={[
          {
            icon: faPlus,
            to: '/config/categories/add'
          }
        ]}
        result={result}
      />
      <Table
        id={(category) => category.id}
        columns={{
          name: { label: 'Name' },
          _count: {
            label: 'Products',
            render: (count) => count.products
          },
          id: {
            label: 'Actions',
            shrink: true,
            render: (id) => (
              <div id="actions">
                <Link to={`/config/categories/${id}`}>
                  <FontAwesomeIcon icon={faPenToSquare}/>
                </Link>
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
        rows={categories}
      />
      <Modal title="Delete" open={open} onClose={() => setOpen(false)}>
        Are you sure you want to delete category {categories.find((c) => c.id === remove)?.name}?
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
