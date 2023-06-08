import Fuse from 'fuse.js';

import products from '~/data/products.server.json';

const fuse = new Fuse(products, {
  keys: ['title'],
  threshold: .25
});

export function getProducts(category: string | undefined, search: string | undefined, sort: string | undefined) {
  let result = [...products];

  if (category) {
    result = result.filter((p) => p.category === category);
  } else if (search) {
    result = fuse.search(search).map((r) => r.item);
  }

  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
}
