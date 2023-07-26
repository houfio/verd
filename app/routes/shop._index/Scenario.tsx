import { faCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Scenario as ScenarioType } from '@prisma/client';

import styles from './Scenario.module.css';

import { useShopData } from '~/hooks/useShopData';

type Props = {
  scenario: ScenarioType
};

export function Scenario({ scenario }: Props) {
  const { products } = useShopData();
  const satisfied = products.some((p) => p.scenarioId === scenario.id);

  return (
    <div className={styles.box}>
      <FontAwesomeIcon icon={satisfied ? faCircleCheck : faCircle} className={styles.icon}/>
      {scenario.text}
    </div>
  );
}
