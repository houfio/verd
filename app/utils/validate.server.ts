import type { TypeOf, ZodError, ZodTypeAny } from 'zod';

import type { ErrorResponse } from '~/types';
import { errorResponse } from '~/utils/errorResponse.server';

type Validate<T extends ZodTypeAny> = { success: false, response: ErrorResponse } | { success: true, data: TypeOf<T> };

export async function validate<T extends ZodTypeAny>(request: Request, shape: T): Promise<Validate<T>> {
  const data = await request.clone().formData();
  const values = Object.fromEntries(data) as Record<string, unknown>;

  for (const key of Object.keys(values)) {
    if (key.endsWith('[]')) {
      delete values[key];

      values[key.substring(0, key.length - 2)] = data.getAll(key) as any;
    }
  }

  const result = await shape.safeParseAsync(values);

  if (!result.success) {
    const error = result.error as ZodError;
    const issues = error.issues.map((issue) => ([
      issue.path.join('.'),
      issue.message
    ] as const));

    return {
      success: false,
      response: errorResponse(...issues)
    };
  }

  return {
    success: true,
    data: result.data
  };
}
