import type { ReactNode } from 'react';

import styles from './Badge.module.css';

type Props = {
  children: ReactNode,
  value: number
};

export function Badge({ children, value }: Props) {
  return (
    <div className={styles.wrapper}>
      {children}
      {value > 0 && (
        <div className={styles.badge}>
          {value}
        </div>
      )}
    </div>
  );
}
