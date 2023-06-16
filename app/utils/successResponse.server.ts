import { json } from '@vercel/remix';

import type { SuccessResponse } from '~/types';

export function successResponse<T>(data: T): SuccessResponse<T>;
export function successResponse<T, S>(data: T, response: S): SuccessResponse<T, S>;

export function successResponse(data: unknown, success = true) {
  if (data instanceof Response) {
    return data;
  }

  return json([success, data, null]);
}
