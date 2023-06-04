import { Link } from '@remix-run/react';

import styles from './ProductGrid.module.css';

import type { ArrayType } from '~/types';
import type { getProducts } from '~/utils/getProducts.server';

type Props = {
  products: ArrayType<ReturnType<typeof getProducts>>[]
};

export function ProductGrid({ products }: Props) {
  return (
    <div className={styles.grid}>
      {products.map((p) => (
        <Link key={p.id} to={`/shop/product/${p.id}`}>
          {p.title}
          <div>
            £{p.price.toFixed(2)}
          </div>
        </Link>
      ))}
    </div>
  )
}
