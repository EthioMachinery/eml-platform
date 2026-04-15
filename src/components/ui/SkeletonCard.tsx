"use client";

export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-gray-200 p-4 rounded">

      <div className="h-40 bg-gray-300 rounded mb-4" />

      <div className="h-4 bg-gray-300 w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 w-1/2 mb-2" />
      <div className="h-4 bg-gray-300 w-1/3" />

    </div>
  );
}