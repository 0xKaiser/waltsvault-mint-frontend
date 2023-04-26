import React, { memo, useMemo } from 'react';

interface BracketsHighlightProps {
  size?: number;
}

function BracketsHighlight(props: BracketsHighlightProps) {
  const { size = 20 } = props;
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0">
      <ButtonBracket size={size} position="top-left" />
      <ButtonBracket size={size} position="top-right" />
      <ButtonBracket size={size} position="bottom-left" />
      <ButtonBracket size={size} position="bottom-right" />
    </div>
  );
}

function ButtonBracket({
  position,
  size,
}: {
  size: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const className = useMemo(() => {
    switch (position) {
      case 'top-left':
        return 'border-l border-t top-0 left-0';
      case 'top-right':
        return 'border-r border-t top-0 right-0';
      case 'bottom-left':
        return 'border-l border-b bottom-0 left-0';
      case 'bottom-right':
        return 'border-r border-b bottom-0 right-0';
      default:
        throw new Error('Unknown position!');
    }
  }, [position]);
  return <div className={`pointer-events-none absolute ${className}`} style={{ height: size, width: size }} />;
}

export default memo(BracketsHighlight);
