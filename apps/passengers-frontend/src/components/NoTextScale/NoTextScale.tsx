import React, { HtmlHTMLAttributes } from 'react';

export default function NoTextScale(props: HtmlHTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div {...rest} className={`scale-[1.666] md:scale-[1.25] lg:scale-[1] ${className}`} />;
}
