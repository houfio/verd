import clsx from 'clsx';
import type { ComponentPropsWithoutRef , ElementType } from 'react';

import styles from './Container.module.css';

type Props<T> = {
  as?: T
};

export function Container<T extends ElementType = 'div'>({ as, ...props }: Props<T> & ComponentPropsWithoutRef<T>) {
  const Component = as ?? 'div';

  return (
    <Component {...props} className={clsx(styles.container, props.className)}/>
  );
}
