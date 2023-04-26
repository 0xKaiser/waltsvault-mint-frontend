import TextTypingAnimation from 'components/TextTypingAnimation';
import { TextTypingAnimationProps } from 'components/TextTypingAnimation/TextTypingAnimation';
import React from 'react';

interface NavigationLinkProps extends TextTypingAnimationProps {
  to: string;
  children: string;
  navigationLinkClasses?: string;
  iconComponent?: React.ReactNode;
}
function NavigationLink({
  to,
  children: text,
  navigationLinkClasses,
  iconComponent,
  ...textTypingAnimationProps
}: NavigationLinkProps) {
  return (
    <a href={to} className={`${navigationLinkClasses} lg:w-full`}>
      <div className="flex flex-row justify-center items-center">
        {iconComponent}
        <TextTypingAnimation {...textTypingAnimationProps}>{text}</TextTypingAnimation>
      </div>
    </a>
  );
}
export default React.memo(NavigationLink);
