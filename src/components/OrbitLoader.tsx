"use client";

import dynamic from "next/dynamic";

const PromiseOrbit = dynamic(() => import("./PromiseOrbit"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-full bg-amber-400/5" />,
});

export default function OrbitLoader() {
  return <PromiseOrbit />;
}
