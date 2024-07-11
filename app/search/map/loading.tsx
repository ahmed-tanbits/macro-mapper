import React from 'react';

type Props = {};

export default function Loading({}: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary-500"></div>
    </div>
  );
}
