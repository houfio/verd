import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json } from '@vercel/remix';

import { Container } from '~/components/Container';
import { Button } from '~/components/form/Button';
import { getConsent } from '~/session.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd' }
  ];
};

export const loader = async ({ request }: LoaderArgs) => json({
  consent: await getConsent(request)
});

export default function Index() {
  const { consent } = useLoaderData<typeof loader>();

  return (
    <Container>
      Welcome to the experiment
      <br/>
      <Button text={consent ? 'Continue' : 'Start'} as={Link} to={consent ? '/survey?k=pre' : '/consent'}/>
    </Container>
  );
}
