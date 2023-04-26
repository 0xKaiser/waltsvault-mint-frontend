import { createContext, useContext } from 'react';
import { AnimationStore } from 'types/interface';

export const AnimationContext = createContext<AnimationStore>({ project: undefined, setProjectConfig: () => {} });

export function useTheaterContext() {
  return useContext(AnimationContext);
}
