import TextTypingAnimation from 'components/TextTypingAnimation';
import React from 'react';

interface DynamicAnimatedTextProps {
  children: string;
  separator: string;
  lineAnimationDuration: number;
  isTextVisible?: boolean;
  textRef?: React.RefObject<HTMLDivElement>;
  lineDelay?: number;
  onFinish?: () => void;
  preloadHeight?: boolean;
  loadFromTheBottom?: boolean;
  stagger?: number;
}
function DynamicAnimatedText({
  children: text,
  separator,
  lineAnimationDuration,
  isTextVisible = true,
  textRef,
  lineDelay = 0,
  onFinish,
  preloadHeight = true,
  loadFromTheBottom = false,
  stagger = 1.0,
}: DynamicAnimatedTextProps) {
  const splitByNewLine = text.split(separator);
  const numberOfLines = splitByNewLine.length;

  function renderAnimatedText({ isPlaceholder }: { isPlaceholder: boolean }) {
    return splitByNewLine.map((line, index) => (
      <TextTypingAnimation
        key={index.toString() + line}
        duration={isPlaceholder ? 0 : lineAnimationDuration}
        delay={isPlaceholder ? 0 : lineDelay + index * stagger + lineAnimationDuration}
        onComplete={!isPlaceholder && index === numberOfLines - 1 ? onFinish : undefined}
        className="break-all">
        {line}
      </TextTypingAnimation>
    ));
  }

  return (
    <div className={`flex relative ${loadFromTheBottom ? 'h-full' : ''}`}>
      <div className={`absolute body flex-col w-full ${loadFromTheBottom ? 'bottom-0' : ''}`} ref={textRef}>
        {isTextVisible && renderAnimatedText({ isPlaceholder: false })}
      </div>
      {preloadHeight && <div className="h-full body opacity-0">{renderAnimatedText({ isPlaceholder: true })}</div>}
    </div>
  );
}
export default React.memo(DynamicAnimatedText);
