import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import styles from './BasketModal.module.css';

type Props = {
  open: boolean,
  onClose: () => void
};

export function BasketModal({ open, onClose }: Props) {
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
                Basket
                <button className={styles.close} onClick={onClose}>
                  <FontAwesomeIcon icon={faTimesCircle} size="xl"/>
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
