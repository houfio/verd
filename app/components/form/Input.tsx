import type { ComponentPropsWithoutRef , ElementType } from 'react';

import styles from './Input.module.css';

type Props<T> = {
  name: string,
  label: string,
  as?: T
};

export function Input<T extends ElementType = 'input'>({ name, label, as, ...props }: Props<T> & ComponentPropsWithoutRef<T>) {
  const Component = as ?? 'input';

  return (
    <div className={styles.wrapper}>
      <label htmlFor={name}>
        {label}
      </label>
      <Component id={name} name={name} className={styles.input} {...props}/>
    </div>
  );
}
