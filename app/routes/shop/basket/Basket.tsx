import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import styles from './Basket.module.css';

import { useMatchesData } from '~/hooks/useMatchesData';
import { Badge } from '~/routes/shop/basket/Badge';
import { BasketModal } from '~/routes/shop/basket/BasketModal';

export function Basket() {
  const [open, setOpen] = useState(false);
  const data = useMatchesData<{ products: string[] }>('routes/shop');

  return (
    <>
      <button className={styles.button} onClick={() => setOpen(true)}>
        <Badge value={data?.products.length ?? 0}>
          <FontAwesomeIcon icon={faBagShopping} size="xl"/>
        </Badge>
      </button>
      <BasketModal open={open} onClose={() => setOpen(false)}/>
    </>
  );
}
