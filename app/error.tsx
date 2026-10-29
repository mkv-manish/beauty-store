"use client";
import Link from "next/link";
import ErrorNotice from "@/components/ui/ErrorNotice";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="section-shell min-h-[60vh]"><h1 className="section-title mb-5">Something went wrong</h1><ErrorNotice action={<><button type="button" onClick={reset}>Try again</button><Link href="/shop">Back to shop</Link></>}>We couldn’t load this page. Please try again.</ErrorNotice></main>;
}
