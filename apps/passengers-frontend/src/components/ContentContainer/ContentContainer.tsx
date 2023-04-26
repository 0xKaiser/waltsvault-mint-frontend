import React from 'react';

export default function ContentContainer(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex flex-1 justify-center">
      <div className="flex flex-1 max-w-[600px]  flex-col relative" {...props} />
    </div>
  );
}
