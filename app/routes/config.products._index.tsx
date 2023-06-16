import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs} from '@vercel/remix';
import { json } from '@vercel/remix';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Table } from '~/components/config/Table';
import { prisma } from '~/db.server';
import { actions } from '~/utils/actions.server';

export const loader = async () => {
  return json({
    products: await prisma.product.findMany()
  });
};

export const action = ({ request }: ActionArgs) => actions(request, {
  delete: z.object({
    id: z.string()
  })
}, {
  delete: async ({ id }) => {
    await prisma.product.delete({
      where: { id }
    });

    return 'Successfully deleted product';
  }
});

export default function Categories() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <>
      <ConfigHeader
        title={['Products']}
        actions={[
          {
            icon: faPlus,
            to: '/config/products/add'
          }
        ]}
      />
      <Table
        id={(product) => product.id}
        columns={{
          brand: { label: 'Brand' },
          name: { label: 'Name' },
          price: {
            label: 'Price',
            render: (price) => `£${price.toFixed(2)}`
          },
          id: {
            label: 'Actions',
            shrink: true,
            render: (id) => (
              <div id="actions">
                <Link to={`/config/products/${id}`}>
                  <FontAwesomeIcon icon={faPenToSquare}/>
                </Link>
                <button>
                  <FontAwesomeIcon icon={faTrash}/>
                </button>
              </div>
            )
          }
        }}
        rows={products}
      />
    </>
  );
}
