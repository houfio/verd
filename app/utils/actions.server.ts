import { Prisma } from '@prisma/client';
import type { TypeOf, ZodTypeAny } from 'zod';

import { errorResponse } from '~/utils/errorResponse.server';
import { successResponse } from '~/utils/successResponse.server';
import { validate } from '~/utils/validate.server';

type ActionsShapeRecord = Record<string, ZodTypeAny>;

type ActionsRecord<T extends ActionsShapeRecord> = {
  [K in keyof T]: (data: TypeOf<T[K]>) => Promise<unknown>
};

type ActionsReturn<T extends ActionsShapeRecord, V extends ActionsRecord<T>> = {
  [K in keyof V]: Awaited<ReturnType<V[K]>>
};

export async function actions<T extends ActionsShapeRecord, V extends ActionsRecord<T>>(request: Request, shapes: T, actions: V) {
  const formData = await request.clone().formData();
  const action = formData.get('action');

  if (typeof action === 'string' && action in actions) {
    const data = await validate(request, shapes[action]);

    if (!data.success) {
      return data.response;
    }

    try {
      const result = await actions[action](data.data as any) as ActionsReturn<T, V>[keyof T];

      return successResponse(result);
    } catch (e) {
      if (!(e instanceof Prisma.PrismaClientKnownRequestError)) {
        const message = typeof e === 'string' ? e : e instanceof Error ? e.message : 'Something went wrong';

        return errorResponse(message);
      }

      const target = e.meta?.target;
      const field = Array.isArray(target) ? target[target.length - 1] : undefined;
      const message = e.meta?.field_name as string ?? 'Already in use';

      return errorResponse([field, message]);
    }
  }

  throw new ReferenceError(`Action '${action}' not found`);
}
