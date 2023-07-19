import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Basket.module.css';

import { useBasketState } from '~/hooks/useBasketState';
import { useShopData } from '~/hooks/useShopData';
import { Badge } from '~/routes/shop/basket/Badge';
import { BasketModal } from '~/routes/shop/basket/BasketModal';

export function Basket() {
  const [open, setOpen] = useBasketState();
  const { products } = useShopData();

  return (
    <>
      <button className={styles.button} onClick={() => setOpen(true)}>
        <Badge value={products.length ?? 0}>
          <FontAwesomeIcon icon={faBagShopping} size="xl"/>
        </Badge>
      </button>
      <BasketModal open={open} onClose={() => setOpen(false)}/>
    </>
  );
}
