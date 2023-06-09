import type { HTMLProps } from 'react';

import styles from './Button.module.css';

type Props = {
  text: string,
  type: 'button' | 'submit' | 'reset'
};

export function Button({ text, ...props }: Props & HTMLProps<HTMLButtonElement>) {
  return (
    <button className={styles.button} {...props}>
      {text}
    </button>
  );
}
