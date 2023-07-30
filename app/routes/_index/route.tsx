import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json } from '@vercel/remix';

import styles from './route.module.css';

import { Container } from '~/components/Container';
import { Expand } from '~/components/Expand';
import { Button } from '~/components/form/Button';
import DebriefText from '~/routes/_index/DebriefText.mdx';
import { getConsent, isDone } from '~/session.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd' }
  ];
};

export const loader = async ({ request }: LoaderArgs) => json({
  consent: await getConsent(request),
  done: await isDone(request)
});

export default function Index() {
  const { consent, done } = useLoaderData<typeof loader>();

  return (
    <Container className={styles.container}>
      <div className={styles.header}>
        <img src="/logo.png" alt="Verd logo" className={styles.logo}/>
        Experiment
      </div>
      <div className={styles.content}>
        {done ? (
          <div className={styles.debrief}>
            <DebriefText/>
          </div>
        ) : (
          <>
            <span>
              Welcome to Verd, the webshop experiment! This experiment contains 4 sections:
            </span>
            <Expand title="A consent form">
              The consent form is a document that tells you what an activity is about, what might happen during it, and
              if there are any possible problems. It lets you choose if you want to take part or not. This form makes
              sure that your rights are protected, and anything you share will be kept private. It's all about making
              sure you understand and agree with what's going to happen.
            </Expand>
            <Expand title="A pre-exposure survey">
              The pre-exposure survey is a set of questions designed to collect basic demographic information from
              participants before they engage in the experiment. It helps the researchers understand the diverse
              backgrounds of participants. Answering the questions is voluntary, and all responses are treated
              confidentially, ensuring privacy and anonymity for the participants.
            </Expand>
            <Expand title="The experiment">
              The webshop experiment. More information can be found in the consent form.
            </Expand>
            <Expand title="A post-exposure survey">
              The post-exposure survey is a set of questions designed to collect opinions and feedback from participants
              after engaging in the experiment. It helps the researchers understand and group the collected results.
              Answering the questions is voluntary, and all responses are treated confidentially, ensuring privacy and
              anonymity for the participants.
            </Expand>
            <span>
              Want to participate? Great! Click on the button below to get started.
            </span>
            <div>
              <Button text={consent ? 'Continue' : 'Start'} as={Link} to={consent ? '/survey?k=pre' : '/consent'}/>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
