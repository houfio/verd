import { NavLink } from '@remix-run/react';
import type { To } from '@remix-run/router';
import clsx from 'clsx';

import styles from './OptionList.module.css';

type Props = {
  title: string,
  active?: number,
  options: {
    title: string,
    to: To
  }[]
};

export function OptionList({ title, active, options }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        {title}
      </div>
      <ul>
        {options.map((option, i) => (
          <li key={i}>
            <NavLink
              to={option.to}
              className={({ isActive }) => clsx(
                styles.option,
                (active !== undefined ? active === i : isActive) && styles.active
              )}
            >
              {option.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
