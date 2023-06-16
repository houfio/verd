import clsx from 'clsx';
import type { HTMLProps } from 'react';

import styles from './Button.module.css';

type Props = {
  text: string,
  white?: boolean,
  type?: 'button' | 'submit' | 'reset'
};

export function Button({ text, white, ...props }: Props & HTMLProps<HTMLButtonElement>) {
  return (
    <button className={clsx(styles.button, white && styles.white)} {...props}>
      {text}
    </button>
  );
}
