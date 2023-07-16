import type { Product } from '@prisma/client';
import clsx from 'clsx';
import { useState } from 'react';

import styles from './Carousel.module.css';

type Props = {
  product: Product
};

export function Carousel({ product }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <div className={styles.wrapper}>
      <img src={product.images[selected]} alt={product.name} className={clsx(styles.image, styles.selected)}/>
      <div className={styles.preview}>
        {product.images.map((image, i) => (
          <button key={i} onClick={() => setSelected(i)}>
            <img src={image} alt={product.name} className={styles.image}/>
          </button>
        ))}
      </div>
    </div>
  );
}
