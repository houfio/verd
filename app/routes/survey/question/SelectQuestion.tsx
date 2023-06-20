import type { Question } from '@prisma/client';

import { Select } from '~/components/form/Select';
import { toOptions } from '~/utils/toOptions';

type Props = {
  question: Question,
  answer?: string
};

export function SelectQuestion({ question, answer }: Props) {
  if (typeof question.data !== 'object' || !('options' in question.data!)) {
    return null;
  }

  return (
    <Select
      name={question.id}
      label={`${question.order + 1}. ${question.title}`}
      values={toOptions(question.data.options as string[], false)}
      defaultValue={answer}
      nullable={true}
    />
  );
}
