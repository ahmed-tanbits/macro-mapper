import React from 'react';

const Skeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 p-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-8 bg-neutral-200 animate-pulse rounded-full"></div>
      ))}
    </div>
  );
};

export default Skeleton;
