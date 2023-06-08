import styles from './Footer.module.css';

import { useMatchesData } from '~/hooks/useMatchesData';

type Props = {
  title: string
};

export function Footer({ title }: Props) {
  const data = useMatchesData('root');

  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="Verd logo"/>
        Verd {title}
      </div>
      <span className={styles.version}>
        {data?.version as string}
      </span>
    </footer>
  );
}
