"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="section-shell min-h-[65vh]"><div className="empty-panel" role="alert"><h1 className="section-title">A little pause</h1><p className="mt-4 text-sm text-[#687169]">We couldn’t load this page. Please try again.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button onClick={reset} className="primary-link">Try again</button><Link href="/shop" className="secondary-link">Back to shop</Link></div></div></main>;
}
