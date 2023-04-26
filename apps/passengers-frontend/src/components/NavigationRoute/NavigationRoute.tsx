import TextTypingAnimation from 'components/TextTypingAnimation';
import { TextTypingAnimationProps } from 'components/TextTypingAnimation/TextTypingAnimation';
import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationRouteProps extends TextTypingAnimationProps {
  to: string;
  children: string;
}
function NavigationRoute({ to, children: text, ...textTypingAnimationProps }: NavigationRouteProps) {
  return (
    <Link to={to} className="w-full">
      <TextTypingAnimation {...textTypingAnimationProps}>{text}</TextTypingAnimation>
    </Link>
  );
}

export default React.memo(NavigationRoute);
