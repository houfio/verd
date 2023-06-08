import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@vercel/remix';

import { ConfigHeader } from '~/components/config/ConfigHeader';
import { prisma } from '~/db.server';

export const loader = async () => {
  return json({
    categories: await prisma.category.findMany()
  });
};

export default function Categories() {
  const { categories } = useLoaderData<typeof loader>();

  return (
    <div>
      <ConfigHeader
        title={['Categories']}
        actions={[
          {
            icon: faPlus,
            to: '/config/categories/add'
          }
        ]}
      />
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link to={`/config/categories/${category.id}`}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
