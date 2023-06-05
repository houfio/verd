import styles from './Footer.module.css';

import { useMatchesData } from '~/hooks/useMatchesData';

export function Footer() {
  const data = useMatchesData('root');

  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="Verd logo"/>
        Verd Shop
      </div>
      <span className={styles.version}>
        {data?.version as string}
      </span>
    </footer>
  );
}
