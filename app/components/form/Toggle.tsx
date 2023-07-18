import { Switch } from '@headlessui/react';
import clsx from 'clsx';

import styles from './Toggle.module.css';

type Props = {
  name: string,
  label: string,
  defaultChecked?: boolean
};

export function Toggle({ name, label, defaultChecked }: Props) {
  return (
    <Switch.Group>
      <div className={styles.wrapper}>
        <Switch
          name={name}
          defaultChecked={defaultChecked}
          className={({ checked }) => clsx(styles.toggle, checked && styles.checked)}
        >
          {({ checked }) => (
            <div className={clsx(styles.handle, checked && styles.checked)}/>
          )}
        </Switch>
        <Switch.Label>
          {label}
        </Switch.Label>
      </div>
    </Switch.Group>
  );
}
