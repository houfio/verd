import Fuse from 'fuse.js';

import products from '~/data/products.server.json';

const fuse = new Fuse(products, {
  shouldSort: false,
  keys: ['title'],
  threshold: .25
});

export function getProducts(filter: number | string | undefined, sort: string | undefined) {
  let result = [...products];

  if (typeof filter === 'number') {
    result = result.filter((p) => p.category === filter);
  } else if (typeof filter === 'string') {
    result = fuse.search(filter).map((r) => r.item);
  }

  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
}
