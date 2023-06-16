import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useLoaderData } from '@remix-run/react';
import { json } from '@vercel/remix';

import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Table } from '~/components/config/Table';
import { prisma } from '~/db.server';

export const loader = async () => {
  return json({
    questions: await prisma.question.findMany({
      include: {
        _count: true
      }
    })
  });
};

export default function Questions() {
  const { questions } = useLoaderData<typeof loader>();

  return (
    <>
      <ConfigHeader
        title={['Questions']}
        actions={[
          {
            icon: faPlus,
            to: '/config/questions/add'
          }
        ]}
      />
      <Table
        id={(question) => question.id}
        columns={{
          title: { label: 'Title' },
          type: {
            label: 'Type',
            render: (type) => `${type[0]}${type.substring(1).toLowerCase()}`
          },
          _count: {
            label: 'Answers',
            render: (count) => count.answers
          }
        }}
        rows={questions}
      />
    </>
  );
}
