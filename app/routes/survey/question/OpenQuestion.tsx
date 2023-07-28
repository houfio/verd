import type { Question } from '@prisma/client';

import { Input } from '~/components/form/Input';

type Props = {
  question: Question,
  answer?: string
};

export function OpenQuestion({ question, answer }: Props) {
  return (
    <Input
      as="textarea"
      name={question.id}
      label={`${question.order + 1}. ${question.title}`}
      defaultValue={answer}
    />
  );
}
