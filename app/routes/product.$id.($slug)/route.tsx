import { useLoaderData } from '@remix-run/react';
import type { LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';
import slugify from 'slugify';

import products from '~/data/products.json';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.product.title} | Verd` }
  ];
};


export const loader = async ({ params }: LoaderArgs) => {
  const product = products.find(({ id }) => String(id) === params.id);

  if (!product) {
    return redirect('/');
  }

  const slug = slugify(product.title, {
    lower: true
  });

  if (params.slug !== slug) {
    return redirect(`/product/${product.id}/${slug}`);
  }

  return json({
    product
  });
};

export default function Product() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <div>
      {JSON.stringify(product)}
    </div>
  );
}