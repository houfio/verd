import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form } from '@remix-run/react';

import styles from './Search.module.css';

export function Search() {
  return (
    <Form action="/shop/search" className={styles.wrapper}>
      <input name="q" placeholder="Search for products..." className={styles.search}/>
      <button type="submit" className={styles.submit}>
        <FontAwesomeIcon icon={faSearch}/>
      </button>
    </Form>
  );
}
