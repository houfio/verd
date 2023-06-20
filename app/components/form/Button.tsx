import clsx from 'clsx';
import type { ComponentPropsWithoutRef , ElementType } from 'react';

import styles from './Button.module.css';

type Props<T> = {
  text: string,
  white?: boolean,
  as?: T
};

export function Button<T extends ElementType = 'button'>({ text, white, as, ...props }: Props<T> & ComponentPropsWithoutRef<T>) {
  const Component = as ?? 'button';

  return (
    <Component className={clsx(styles.button, white && styles.white)} {...props}>
      {text}
    </Component>
  );
}
