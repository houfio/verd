import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import styles from './BasketModal.module.css';

import { useShopData } from '~/hooks/useShopData';
import { BasketProduct } from '~/routes/shop/basket/BasketProduct';

type Props = {
  open: boolean,
  onClose: () => void
};

export function BasketModal({ open, onClose }: Props) {
  const { products } = useShopData();

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
              <div className={styles.content}>
                {products.length ? products.map((product) => (
                  <BasketProduct key={product.id} product={product}/>
                )) : (
                  <div className={styles.empty}>
                    Your basket is empty
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
