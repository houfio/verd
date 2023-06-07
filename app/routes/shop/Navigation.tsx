import { Link } from '@remix-run/react';
import clsx from 'clsx';

import styles from './Navigation.module.css';

import { Search } from '~/routes/shop/Search';
import { Basket } from '~/routes/shop/basket/Basket';

export function Navigation() {
  return (
    <>
      <nav className={styles.navigation}>
        <div className={styles.section}>
          <Link to="/shop" className={clsx(styles.link, styles.logo)}>
            <img src="/logo.png" alt="Verd logo" className={styles.logo}/>
          </Link>
          <Link to="/shop">
            Home
          </Link>
          <Link to="/shop/search">
            Products
          </Link>
        </div>
        <div className={clsx(styles.section, styles.desktop)}>
          <Search/>
        </div>
        <div className={styles.section}>
          <Basket/>
        </div>
      </nav>
      <div className={styles.search}>
        <Search/>
      </div>
    </>
  );
}
