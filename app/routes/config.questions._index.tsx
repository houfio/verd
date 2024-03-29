import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@vercel/remix';

import { ConfigHeader } from '~/components/config/ConfigHeader';
import { Table } from '~/components/config/Table';
import { db } from '~/db.server';

export const loader = async () => json({
  questions: await db.question.findMany()
});

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
          survey: {
            label: 'Survey',
            render: (survey) => `${survey[0]}${survey.substring(1).toLowerCase()}`
          },
          type: {
            label: 'Type',
            render: (type) => `${type[0]}${type.substring(1).toLowerCase()}`
          },
          order: { label: 'Order' },
          id: {
            label: 'Actions',
            shrink: true,
            render: (id) => (
              <div id="actions">
                <Link to={`/config/questions/${id}`}>
                  <FontAwesomeIcon icon={faPenToSquare}/>
                </Link>
              </div>
            )
          }
        }}
        rows={questions}
      />
    </>
  );
}
