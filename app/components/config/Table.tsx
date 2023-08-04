import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './Table.module.css';

type Column<T, K extends keyof T = keyof T> = {
  label: string,
  shrink?: boolean,
  render?: (value: T[K], data: T) => ReactNode
};

type Props<T> = {
  id: (row: T) => string,
  columns: {
    [K in keyof T]?: Column<T, K>
  },
  rows: T[],
  rowClassName?: (row: T) => string | undefined
};

export function Table<T>({ id, columns, rows, rowClassName }: Props<T>) {
  const entries = Object.entries(columns) as [keyof T & string, Column<T>][];

  return (
    <table className={styles.table}>
      <thead className={styles.head}>
        <tr>
          {entries.map(([column, { label }]) => (
            <th key={column}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={styles.body}>
        {rows.map((row) => (
          <tr key={id(row)} className={rowClassName?.(row)}>
            {entries.map(([column, { shrink, render }]) => (
              <td key={column} className={clsx(shrink && styles.shrink)}>
                {render?.(row[column], row) ?? row[column] as ReactNode}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
