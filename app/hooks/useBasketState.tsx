import type { ReactNode , Dispatch, SetStateAction} from 'react';
import { createContext, useContext, useState } from 'react';

const context = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>(undefined!);

export function useBasketState() {
  return useContext(context);
}

useBasketState.Provider = ({ children }: { children?: ReactNode }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const state = useState(false);

  return (
    <context.Provider value={state}>
      {children}
    </context.Provider>
  );
};
