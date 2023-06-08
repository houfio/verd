import { Link, useSearchParams } from '@remix-run/react';

import styles from './ProductGrid.module.css';

import type { ArrayType } from '~/types';
import type { getProducts } from '~/utils/getProducts.server';

type Props = {
  products: ArrayType<ReturnType<typeof getProducts>>[]
};

export function ProductGrid({ products }: Props) {
  const [searchParams] = useSearchParams();

  return (
    <div className={styles.wrapper}>
      {searchParams.has('q') && (
        <div className={styles.search}>
          Showing results for <span className={styles.bold}>"{searchParams.get('q')}"</span>
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
              {p.brand}
              <div className={styles.line}>
                {p.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
