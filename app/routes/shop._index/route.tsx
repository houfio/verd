import { Form } from '@remix-run/react';
import type { ActionArgs } from '@vercel/remix';
import { redirect } from '@vercel/remix';

import styles from './route.module.css';

import { Container } from '~/components/Container';
import { Button } from '~/components/form/Button';
import { useShopData } from '~/hooks/useShopData';
import { Scenario } from '~/routes/shop._index/Scenario';
import { actions } from '~/utils/actions.server';

export const action = ({ request }: ActionArgs) => actions(request, {
  finish: null
}, {
  finish: async () => {
    return redirect('/survey?k=post');
  }
});

export default function ShopIndex() {
  const { scenarios } = useShopData();

  return (
    <Container className={styles.container}>
      <div className={styles.scenarios}>
        These are the scenarios that you're trying to find appropriate products for. You can find items currently in
        your basket by clicking on the 'basket' icon in the top right corner.
        {scenarios.map((scenario) => (
          <Scenario key={scenario.id} scenario={scenario}/>
        ))}
        Added the appropriate products to the basket? Click on the button below to finish.
        <Form method="post">
          <input type="hidden" name="action" value="finish"/>
          <Button text="Finish" style={{ width: '100%' }}/>
        </Form>
      </div>
    </Container>
  );
}
