import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createPath, Link } from '@remix-run/react';
import type { To } from '@remix-run/router';

import styles from './ConfigHeader.module.css';

import { Message } from '~/components/config/Message';
import type { ErrorResponse, ResponseType, SuccessResponse } from '~/types';

type Props = {
  title: string[],
  actions?: {
    icon: IconProp,
    to: To,
    download?: string
  }[],
  result?: ResponseType<SuccessResponse<unknown> | ErrorResponse>
};

export function ConfigHeader({ title, actions, result }: Props) {
  return (
    <>
      <div>
        {result?.[0] && typeof result[1] === 'string' && (
          <Message message={{ type: 'info', message: result[1] }}/>
        )}
        {result?.[0] === false && result[2].map(({ field, message }, i) => (
          <Message key={i} message={{ type: 'error', message: field ? `${field}: ${message}` : message }}/>
        ))}
      </div>
      <div className={styles.header}>
        <span className={styles.title}>
          {title.map((t, i) => (
            <span key={i}>
              {t}
            </span>
          ))}
        </span>
        {actions?.map((action, i) => action.download ? (
          <a
            key={i}
            href={typeof action.to === 'string' ? action.to : createPath(action.to)}
            className={styles.action}
            download={action.download}
          >
            <FontAwesomeIcon icon={action.icon}/>
          </a>
        ) : (
          <Link key={i} to={action.to} className={styles.action}>
            <FontAwesomeIcon icon={action.icon}/>
          </Link>
        ))}
      </div>
    </>
  );
}
