import { Form } from '@remix-run/react';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { redirect } from '@vercel/remix';
import { z } from 'zod';

import styles from './route.module.css';

import { Button } from '~/components/form/Button';
import { Toggle } from '~/components/form/Toggle';
import ConsentText from '~/routes/consent/ConsentText.mdx';
import { getConsent, giveConsent } from '~/session.server';
import { actions } from '~/utils/actions.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd | Consent' }
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const consent = await getConsent(request);

  if (consent) {
    return redirect('/survey?kind=pre');
  }

  return null;
};

export const action = ({ request }: ActionArgs) => actions(request, {
  accept: z.object({
    accept: z.literal('on')
  })
}, {
  accept: async () => {
    const headers = await giveConsent(request);

    return redirect('/survey?kind=pre', { headers });
  }
});

export default function Consent() {
  return (
    <div className={styles.consent}>
      <ConsentText/>
      <Form method="post" className={styles.form}>
        <input type="hidden" name="action" value="accept"/>
        <Toggle
          name="accept"
          label="I consent to take part in this study conducted by the researcher who intends to use my data for further research."
        />
        <Button text="Continue" type="submit"/>
      </Form>
    </div>
  );
}
