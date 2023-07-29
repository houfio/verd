import styles from './route.module.css';

import { Container } from '~/components/Container';
import { useShopData } from '~/hooks/useShopData';

export default function ShopIndex() {
  const { scenario, current } = useShopData();

  return (
    <Container className={styles.container}>
      This is the current scenario you're in. Find <b>one</b> appropriate product to satisfy this requirement.
      When you've found the product, click on "<b>Select this product</b>" on the product page. You will automatically be forwarded to the next scenario.
      In total, there are <b>3</b> scenarios.
      <div className={styles.box}>
        Scenario {current}
        <div className={styles.text}>
          {scenario.text}
        </div>
      </div>
      Once all scenarios have been completed, the experiment ends automatically.
    </Container>
  );
}
