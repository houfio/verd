import type { TypeOf, ZodTypeAny } from 'zod';

import type { ErrorResponse } from '~/types';
import { errorResponse } from '~/utils/errorResponse.server';

type Validate<T extends ZodTypeAny | null> = { success: false, response: ErrorResponse } | { success: true, data: T extends ZodTypeAny ? TypeOf<T> : Record<string, unknown> };

export async function validate<T extends ZodTypeAny | null>(request: Request, shape: T): Promise<Validate<T>> {
  const data = await request.clone().formData();
  const values = Object.fromEntries(data) as Record<string, unknown>;

  for (const key of Object.keys(values)) {
    if (key.endsWith('[]')) {
      delete values[key];

      values[key.substring(0, key.length - 2)] = data.getAll(key) as any;
    }
  }

  if (!shape) {
    return {
      success: true,
      data: values as any
    };
  }

  const result = await shape.safeParseAsync(values);

  if (!result.success) {
    const issues = result.error.flatten();
    const errors = [
      ...issues.formErrors,
      ...Object.entries(issues.fieldErrors).flatMap(([field, messages]) => messages?.map((message) => ([
        field,
        message
      ] as const)) ?? [])
    ];

    return {
      success: false,
      response: errorResponse(...errors)
    };
  }

  return {
    success: true,
    data: result.data
  };
}
