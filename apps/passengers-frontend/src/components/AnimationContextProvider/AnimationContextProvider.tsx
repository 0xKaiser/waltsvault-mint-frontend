import { getProject, IProject, IProjectConfig } from '@theatre/core';
import { AnimationContext } from 'hooks/useTheaterContext';
import React, { useCallback, useMemo, useState } from 'react';

interface AnimationContextProviderProps {
  children?: React.ReactNode;
}
export default function AnimationContextProvider({ children }: AnimationContextProviderProps) {
  const [project, setProject] = useState<IProject>();

  const setProjectConfig = useCallback((id: string, configFile?: IProjectConfig) => {
    const newProject = getProject(id, configFile);
    setProject(newProject);
  }, []);

  const contextValue = useMemo(() => ({ project, setProjectConfig }), [project, setProjectConfig]);

  return <AnimationContext.Provider value={contextValue}>{children}</AnimationContext.Provider>;
}
