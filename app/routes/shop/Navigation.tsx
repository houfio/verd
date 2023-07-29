import { Link, NavLink } from '@remix-run/react';
import clsx from 'clsx';

import styles from './Navigation.module.css';

import { useShopData } from '~/hooks/useShopData';
import { Search } from '~/routes/shop/Search';

export function Navigation() {
  const { total, current } = useShopData();

  return (
    <>
      <nav className={styles.navigation}>
        <div className={styles.section}>
          <Link to="/shop" className={clsx(styles.link, styles.logo)}>
            <img src="/logo.png" alt="Verd logo" className={styles.logo}/>
          </Link>
          <NavLink to="/shop" end={true}>
            Scenario
          </NavLink>
          <NavLink to="/shop/search">
            Products
          </NavLink>
        </div>
        <div className={clsx(styles.section, styles.desktop)}>
          <Search/>
        </div>
        <div className={styles.section}>
          Scenario {current}/{total}
        </div>
      </nav>
      <div className={styles.search}>
        <Search/>
      </div>
    </>
  );
}
