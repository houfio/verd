import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@remix-run/react';
import type { To } from '@remix-run/router';

import styles from './ConfigHeader.module.css';

type Props = {
  title: string[],
  actions?: {
    icon: IconProp,
    to: To
  }[]
};

export function ConfigHeader({ title, actions }: Props) {
  return (
    <div className={styles.header}>
      <span className={styles.title}>
        {title.map((t, i) => (
          <span key={i}>
            {t}
          </span>
        ))}
      </span>
      {actions?.map((action, i) => (
        <Link key={i} to={action.to} className={styles.action}>
          <FontAwesomeIcon icon={action.icon}/>
        </Link>
      ))}
    </div>
  )
}
