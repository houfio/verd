import type { Product } from '@prisma/client';
import { Link, useSearchParams } from '@remix-run/react';

import styles from './ProductGrid.module.css';

import { useShopData } from '~/hooks/useShopData';
import { ExperimentCondition } from '~/utils/ExperimentCondition';

type Props = {
  products: Product[]
};

export function ProductGrid({ products }: Props) {
  const [searchParams] = useSearchParams();
  const { condition } = useShopData();

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
              <img src={p.images[0]} alt={p.name} className={styles.image}/>
              {condition === ExperimentCondition.EXPERIMENTAL && p.label && (
                <img
                  src={p.label}
                  className={styles.label}
                  alt="Certification"
                />
              )}
            </div>
            <div className={styles.title}>
              {p.brand}
              <div className={styles.line}>
                {p.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
