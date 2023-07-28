import { faCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Question } from '@prisma/client';

import styles from './ScaleQuestion.module.css';

type Props = {
  question: Question,
  answer?: string
};

export function ScaleQuestion({ question }: Props) {
  if (typeof question.data !== 'object' || !('options' in question.data!)) {
    return null;
  }

  return (
    <div>
      {question.order + 1}. {question.title}
      <div className={styles.radio}>
        {(question.data.options as string[]).map((option, i) => (
          <label key={i} htmlFor={`${question.id}-${i}`} className={styles.label}>
            <input type="radio" id={`${question.id}-${i}`} name={question.id} value={i}/>
            <FontAwesomeIcon icon={faCircle} className={styles.unchecked}/>
            <FontAwesomeIcon icon={faCircleCheck} className={styles.checked}/>
            <span>
            {option}
          </span>
          </label>
        ))}
      </div>
    </div>
  );
}
