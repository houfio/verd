import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs } from '@vercel/remix';
import { json } from '@vercel/remix';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Table } from '~/components/config/Table';
import { prisma } from '~/db.server';
import { actions } from '~/utils/actions.server';

export const loader = async () => {
  return json({
    categories: await prisma.category.findMany({
      include: {
        _count: true
      }
    })
  });
};

export const action = ({ request }: ActionArgs) => actions(request, {
  delete: z.object({
    id: z.string()
  })
}, {
  delete: async ({ id }) => {
    await prisma.category.delete({
      where: { id }
    });

    return 'Successfully deleted category';
  }
});

export default function Categories() {
  const { categories } = useLoaderData<typeof loader>();

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
                <button>
                  <FontAwesomeIcon icon={faTrash}/>
                </button>
              </div>
            )
          }
        }}
        rows={categories}
      />
    </>
  );
}
