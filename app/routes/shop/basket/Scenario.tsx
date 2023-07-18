import type { Scenario as ScenarioType } from '@prisma/client';
import clsx from 'clsx';

import styles from './Scenario.module.css';

import { useShopData } from '~/hooks/useShopData';

type Props = {
  scenario: ScenarioType
};

export function Scenario({ scenario }: Props) {
  const { products } = useShopData();
  const satisfied = products.some((p) => p.scenarioId === scenario.id);

  return (
    <div className={clsx(styles.box, satisfied && styles.satisfied)}>
      {scenario.text}
    </div>
  );
}
