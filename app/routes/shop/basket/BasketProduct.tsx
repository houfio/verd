import type { Product } from '@prisma/client';
import { Link } from '@remix-run/react';

import styles from './BasketProduct.module.css';

import { useBasketState } from '~/hooks/useBasketState';

type Props = {
  product: Partial<Product>
}

export function BasketProduct({ product }: Props) {
  const [, setOpen] = useBasketState();

  return (
    <Link
      to={`/shop/product/${product.id}`}
      className={styles.product}
      onClick={() => setOpen(false)}
    >
      <img className={styles.image} src={product.images?.[0]} alt={product.name}/>
      <div className={styles.details}>
        <span>
          {product.brand}
        </span>
        <span>
          {product.name}
        </span>
      </div>
      £{product.price?.toFixed(2)}
    </Link>
  );
}
