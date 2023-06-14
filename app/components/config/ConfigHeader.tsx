import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@remix-run/react';
import type { To } from '@remix-run/router';

import styles from './ConfigHeader.module.css';

import { Message } from '~/components/config/Message';

type Props = {
  title: string[],
  actions?: {
    icon: IconProp,
    to: To
  }[],
  message?: string
};

export function ConfigHeader({ title, actions, message }: Props) {
  return (
    <>
      {message && (
        <Message message={{ message, type: 'error' }}/>
      )}
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
    </>
  )
}
