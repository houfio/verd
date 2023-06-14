import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import styles from './Message.module.css';

type Props = {
  message: {
    type: string,
    message: string
  }
};

export function Message({ message }: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => setHidden(false), [message]);

  return hidden ? null : (
    <div className={clsx(styles.message, styles[message.type])}>
      {message.message}
      <button onClick={() => setHidden(true)}>
        <FontAwesomeIcon icon={faTimes}/>
      </button>
    </div>
  );
}
