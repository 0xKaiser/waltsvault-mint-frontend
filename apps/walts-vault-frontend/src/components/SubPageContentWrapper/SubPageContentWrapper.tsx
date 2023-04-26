import React from 'react';

interface SubPageContentWrapperProps {
  children: React.ReactNode;
}
export default function SubPageContentWrapper({ children }: SubPageContentWrapperProps) {
  return <div className="relative h-full w-[68%] py-10 ">{children}</div>;
}
