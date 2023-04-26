import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import React from 'react';

interface ContentSectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}
export default function ContentSection({ title, description, children }: ContentSectionProps) {
  const { isMobile } = useBreakpoints();

  const computedTitle = React.useMemo(() => {
    if (!isMobile) return title;
    return title.split('— ').join('—\n');
  }, [title, isMobile]);

  const margin = description ? 24 : 44;

  return (
    <div className="my-9">
      <div className="caption uppercase whitespace-pre" style={{ marginBottom: margin }}>
        {computedTitle}
      </div>
      {description && <div className="description mb-11">{description}</div>}
      {children}
    </div>
  );
}
