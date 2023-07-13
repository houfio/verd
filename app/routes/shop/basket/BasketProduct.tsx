import type { Product } from '@prisma/client';

import styles from './BasketProduct.module.css';

type Props = {
  product: Partial<Product>
}

export function BasketProduct({ product }: Props) {
  return (
    <div className={styles.product}>
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
    </div>
  );
}
