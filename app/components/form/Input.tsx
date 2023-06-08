import type { HTMLProps } from 'react';

import styles from './Input.module.css';

type Props = {
  name: string,
  label: string
};

export function Input({ name, label, ...props }: Props & HTMLProps<HTMLInputElement>) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} className={styles.input} {...props}/>
    </div>
  );
}
