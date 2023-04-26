import SubPageContainer from 'components/SubPageContainer';
import React from 'react';

interface SubPageLayoutProps {
  backgroundVideoSrc?: string;
  title: string;
  children: string | React.ReactNode;
}
export default function SubPageLayout(props: SubPageLayoutProps) {
  const { backgroundVideoSrc, title, children } = props;

  return (
    <SubPageContainer>
      {backgroundVideoSrc && (
        <video className="cover object-cover" src={backgroundVideoSrc} autoPlay muted loop playsInline />
      )}
      <div className="relative h-full w-[68%] flex justify-center items-center flex-col">
        <h1 className="text-center">{title}</h1>
        {typeof children === 'string' ? <h3 className="text-center ">{children}</h3> : children}
      </div>
    </SubPageContainer>
  );
}
