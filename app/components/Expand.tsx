import { faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure } from '@headlessui/react';
import type { ReactNode } from 'react';

import styles from './Expand.module.css';

type Props = {
  title: string,
  children?: ReactNode
};

export function Expand({ title, children }: Props) {
  return (
    <div className={styles.expand}>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className={styles.button}>
              <FontAwesomeIcon icon={open ? faCircleChevronUp : faCircleChevronDown}/> {title}
            </Disclosure.Button>
            <Disclosure.Panel className={styles.panel}>
              {children}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
