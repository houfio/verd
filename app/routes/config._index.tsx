import { redirect } from '@vercel/remix';

export const loader = async () => redirect('/config/products');
