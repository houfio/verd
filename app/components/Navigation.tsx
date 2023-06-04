import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@remix-run/react';
import clsx from 'clsx';

import styles from './Navigation.module.css';

import { Badge } from '~/components/Badge';

export function Navigation() {
  return (
    <nav className={styles.navigation}>
      <div className={styles.section}>
        <Link to="/" className={clsx(styles.link, styles.logo)}>
          <img src="/logo.png" alt="Verd logo" className={styles.logo}/>
        </Link>
        <Link to="/" className={styles.link}>
          Home
        </Link>
        <Link to="/search" className={styles.link}>
          Products
        </Link>
      </div>
      <div className={styles.section}>
        search
      </div>
      <div className={styles.section}>
        <button>
          <Badge value={1}>
            <FontAwesomeIcon icon={faBagShopping} size="xl"/>
          </Badge>
        </button>
      </div>
    </nav>
  );
}
