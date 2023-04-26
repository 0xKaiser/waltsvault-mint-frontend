import React from 'react';

interface ContentParagraphProps {
  title: string;
  children: string;
}
export default function ContentParagraph({ title, children }: ContentParagraphProps) {
  return (
    <div className="mb-12 last:mb-0">
      <div className="caption-small mb-3 text-primary-blue uppercase">{title}</div>
      <div className="description">{children}</div>
    </div>
  );
}
