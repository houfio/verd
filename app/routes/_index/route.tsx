import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json } from '@vercel/remix';

import styles from './route.module.css';

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
    <Container className={styles.container}>
      <div className={styles.header}>
        <img src="/logo.png" alt="Verd logo" className={styles.logo}/>
        Experiment
      </div>
      Welcome to Verd, the webshop experiment! This experiment contains 4 sections:
      <ol>
        <li>A consent form</li>
        <li>A demographic survey</li>
        <li>The experiment itself</li>
        <li>A post-exposure survey</li>
      </ol>

      <Button text={consent ? 'Continue' : 'Start'} as={Link} to={consent ? '/survey?k=pre' : '/consent'}/>
    </Container>
  );
}
