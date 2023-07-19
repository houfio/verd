import type { Product } from '@prisma/client';
import clsx from 'clsx';
import { useState } from 'react';

import styles from './Carousel.module.css';

import { useShopData } from '~/hooks/useShopData';
import { ExperimentCondition } from '~/utils/ExperimentCondition';

type Props = {
  product: Product
};

export function Carousel({ product }: Props) {
  const { condition } = useShopData();
  const [selected, setSelected] = useState(0);

  const images = [
    ...product.images,
    ...condition === ExperimentCondition.LABELS && product.label ? [product.label] : []
  ];

  return (
    <div className={styles.wrapper}>
      <img src={images[selected]} alt={product.name} className={clsx(styles.image, styles.selected)}/>
      <div className={styles.preview}>
        {images.map((image, i) => (
          <button key={i} onClick={() => setSelected(i)}>
            <img src={image} alt={product.name} className={styles.image}/>
          </button>
        ))}
      </div>
    </div>
  );
}
