import NoTextScale from 'components/NoTextScale';
import React, { useMemo } from 'react';

interface FlightListStatusBoxProps {
  children?: React.ReactNode;
  error?: boolean;
  warning?: boolean;
  loading?: boolean;
  title?: string;
}

export default function FlightListStatusBox({ children, error, loading, title, warning }: FlightListStatusBoxProps) {
  const textColor = useMemo(() => {
    if (error) return 'text-error';
    if (warning) return 'text-warning';
    return 'text-primary-blue';
  }, [error, warning]);

  const borderColor = useMemo(() => {
    if (error) return 'border-error';
    if (warning) return 'border-warning';
    return 'border-primary-blue';
  }, [error, warning]);

  function renderChildren() {
    if (loading) return <p className="text-white">loading...</p>;
    return typeof children === 'string' ? <p className={`${textColor}`}>{children}</p> : children;
  }

  return (
    <div className="flex flex-col items-center">
      <NoTextScale>
        <div className={`text-center w-full caption-small uppercase ${textColor} pb-[16px]`}>{title}</div>
      </NoTextScale>
      <div className={`relative ${textColor}`}>
        <div className={`w-[390px] h-[64px] border-[2px] ${borderColor} flex justify-center items-center`}>
          <NoTextScale>{renderChildren()}</NoTextScale>
        </div>
      </div>
    </div>
  );
}
