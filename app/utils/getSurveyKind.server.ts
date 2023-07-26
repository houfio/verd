import { Survey as SurveyKind } from '@prisma/client';

export function getSurveyKind(request: Request) {
  const url = new URL(request.url);
  const k = url.searchParams.get('k')?.toUpperCase();

  if (!k || !(k in SurveyKind)) {
    return;
  }

  return k as SurveyKind;
}
