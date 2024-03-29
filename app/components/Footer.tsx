import styles from './Footer.module.css';

import { Container } from '~/components/Container';
import { useMatchesData } from '~/hooks/useMatchesData';
import type { loader } from '~/root';

type Props = {
  title: string
};

export function Footer({ title }: Props) {
  const data = useMatchesData<typeof loader>('root');

  return (
    <Container as="footer" className={styles.footer}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="Verd logo"/>
        Verd {title}
      </div>
      <span className={styles.version}>
        {data?.version}
      </span>
    </Container>
  );
}
