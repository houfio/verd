import { Link } from '@remix-run/react';

import styles from './ProductGrid.module.css';

import type { ArrayType } from '~/types';
import type { getProducts } from '~/utils/getProducts.server';

type Props = {
  search?: string,
  products: ArrayType<ReturnType<typeof getProducts>>[]
};

export function ProductGrid({ search, products }: Props) {
  return (
    <div className={styles.wrapper}>
      {search && (
        <div className={styles.search}>
          Showing results for <span className={styles.bold}>"{search}"</span>
        </div>
      )}
      <div className={styles.grid}>
        {products.map((p) => (
          <Link key={p.id} to={`/shop/product/${p.id}`} className={styles.product}>
            <div className={styles.imageWrapper}>
              <div className={styles.price}>
                £{p.price.toFixed(2)}
              </div>
              <img src={p.image} alt={p.title} className={styles.image}/>
            </div>
            <div className={styles.title}>
              {p.title.substring(0, 50).trim()}
              {p.title.length > 50 && '...'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
