import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import type { ReactNode } from 'react';
import { Fragment } from 'react';

import styles from './Modal.module.css';

type Props = {
  title: string,
  open: boolean,
  onClose: () => void,
  children?: ReactNode
};

export function Modal({ title, open, onClose, children }: Props) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose}>
        <Transition.Child as={Fragment} enterTo={styles.open}>
          <div className={styles.backdrop} aria-hidden="true"/>
        </Transition.Child>
        <div className={styles.modal}>
          <Transition.Child as={Fragment} enterTo={styles.open}>
            <Dialog.Panel className={styles.panel}>
              <div className={styles.header}>
                {title}
                <button className={styles.close} onClick={onClose}>
                  <FontAwesomeIcon icon={faTimesCircle} size="xl"/>
                </button>
              </div>
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
