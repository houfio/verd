import { json } from '@vercel/remix';

import type { ErrorResponse } from '~/types';

export function errorResponse(...errors: (string | readonly [string, string])[]): ErrorResponse {
  return json([
    false,
    null,
    errors.map((e) => ({
      field: Array.isArray(e) ? e[0] : undefined,
      message: Array.isArray(e) ? e[1] : e
    }))
  ], 400);
}
