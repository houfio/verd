import { Link } from '@remix-run/react';
import type { To } from '@remix-run/router';
import clsx from 'clsx';

import styles from './OptionList.module.css';

type Props = {
  title: string,
  selected: number,
  options: {
    title: string,
    to: To
  }[]
};

export function OptionList({ title, selected, options }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        {title}
      </div>
      <ul>
        {options.map((option, i) => (
          <li key={i}>
            <Link to={option.to} className={clsx(styles.option, selected === i && styles.selected)}>
              {option.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
