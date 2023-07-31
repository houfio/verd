import { faCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Question } from '@prisma/client';

import styles from './ScaleQuestion.module.css';

type Props = {
  question: Question,
  answer?: string
};

export function ScaleQuestion({ question, answer }: Props) {
  if (typeof question.data !== 'object' || !('options' in question.data!)) {
    return null;
  }

  const options = [
    ...question.data.options as string[],
    'Prefer not to say'
  ];

  return (
    <div>
      {question.order + 1}. {question.title}
      <div className={styles.radio}>
        {options.map((option, i) => {
          const value = i === options.length - 1 ? -1 : i;

          return (
            <label key={i} htmlFor={`${question.id}-${i}`} className={styles.label}>
              <input
                type="radio"
                id={`${question.id}-${i}`}
                name={question.id}
                value={value}
                defaultChecked={String(value) === answer}
              />
              <FontAwesomeIcon icon={faCircle} className={styles.unchecked}/>
              <FontAwesomeIcon icon={faCircleCheck} className={styles.checked}/>
              <span>
                {option}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
