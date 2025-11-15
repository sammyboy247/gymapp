import React from 'react';

export const SessionCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 border rounded-lg bg-zinc-100 animate-pulse">
      <div className="h-6 bg-zinc-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-zinc-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-zinc-300 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-zinc-300 rounded w-1/4"></div>
    </div>
  );
};
