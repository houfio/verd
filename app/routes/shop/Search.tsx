import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, useSearchParams } from '@remix-run/react';

import styles from './Search.module.css';

export function Search() {
  const [searchParams] = useSearchParams();

  return (
    <Form action="/shop/search" className={styles.wrapper}>
      <input name="q" placeholder="Search for products..." className={styles.search}/>
      {searchParams.has('s') && (
        <input name="s" type="hidden" value={searchParams.get('s') ?? ''}/>
      )}
      <button type="submit" className={styles.submit}>
        <FontAwesomeIcon icon={faSearch}/>
      </button>
    </Form>
  );
}
