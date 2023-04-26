import React, { ReactNode } from 'react';

interface NoiseBackgroundProps {
  children: ReactNode;
}
export default function NoiseBackground({ children }: NoiseBackgroundProps) {
  return <div className="flex flex-col w-full h-full bg-noise-pattern bg-contain bg-repeat">{children}</div>;
}
