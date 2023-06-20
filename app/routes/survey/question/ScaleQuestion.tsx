import type { Question } from '@prisma/client';

type Props = {
  question: Question,
  answer?: string
};

export function ScaleQuestion({ question }: Props) {
  return null;
}
