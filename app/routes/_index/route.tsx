import { Form } from '@remix-run/react';
import type { ActionArgs } from '@vercel/remix';
import { z } from 'zod';

import styles from './route.module.css';

import { Button } from '~/components/form/Button';
import { Toggle } from '~/components/form/Toggle';
import Consent from '~/routes/_index/Consent.mdx';
import { actions } from '~/utils/actions.server';
import { successResponse } from '~/utils/successResponse.server';

export const action = ({ request }: ActionArgs) => actions(request, {
  accept: z.object({
    accept: z.literal('on')
  })
}, {
  accept: async () => {
    return successResponse('oke');
  }
});

export default function Index() {
  return (
    <div className={styles.consent}>
      <Consent/>
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
