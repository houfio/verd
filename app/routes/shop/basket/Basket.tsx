import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import styles from './Basket.module.css';

import { Badge } from '~/routes/shop/basket/Badge';
import { BasketModal } from '~/routes/shop/basket/BasketModal';

export function Basket() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={styles.button} onClick={() => setOpen(true)}>
        <Badge value={1}>
          <FontAwesomeIcon icon={faBagShopping} size="xl"/>
        </Badge>
      </button>
      <BasketModal open={open} onClose={() => setOpen(false)}/>
    </>
  );
}
