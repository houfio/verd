import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@vercel/remix';

import { ConfigHeader } from '~/components/config/ConfigHeader';
import { prisma } from '~/db.server';

export const loader = async () => {
  return json({
    products: await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        brand: true
      }
    })
  });
};

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
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/config/products/${product.id}`}>
              {product.brand} {product.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
