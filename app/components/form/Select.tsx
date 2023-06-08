import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Combobox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useState } from 'react';

import styles from './Select.module.css';

type Props = {
  name: string,
  label: string,
  values: {
    key: string,
    value: string
  }[],
  defaultValue?: string
};

export function Select({ name, label, values, defaultValue = values[0].key }: Props) {
  const [query, setQuery] = useState('');

  const filtered = !query ? values : values.filter((v) => {
    return v.value.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className={styles.wrapper}>
      <Combobox name={name} defaultValue={defaultValue}>
        <div className={styles.combobox}>
          <Combobox.Label>{label}</Combobox.Label>
          <div>
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(v) => values.find((v1) => v1.key === v)?.value ?? ''}
              className={styles.input}
            />
            <Combobox.Button className={styles.button}>
              {({ open }) => (
                <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown}/>
              )}
            </Combobox.Button>
          </div>
          <Transition as={Fragment} afterLeave={() => setQuery('')}>
            <Combobox.Options className={styles.options}>
              {filtered.length === 0 ? (
                <div>
                  No options found
                </div>
              ) : filtered.map((v) => (
                <Combobox.Option
                  key={v.key}
                  value={v.key}
                  className={({ active }) => clsx(styles.option, active && styles.active)}
                >
                  {v.value}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
