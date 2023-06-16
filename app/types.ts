import type { TypedResponse } from '@vercel/remix';

export type SuccessResponse<T, S = true> = T extends TypedResponse<infer R> ? R : TypedResponse<[success: S, data: T, errors: null]>;
export type ErrorResponse = TypedResponse<[success: false, data: null, errors: FormErrors]>;

export type FormErrors = Array<{
  field?: string,
  message: string
}>;

export type ResponseType<T> = T extends TypedResponse<infer R> ? R : never;
