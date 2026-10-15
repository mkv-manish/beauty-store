"use client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
type Quote = { subtotal: number; total: number; discount: number; code: string };
export default function DiscountCode({ items, onCode }: { items: { _id: string; quantity: number }[]; onCode: (code: string) => void }) {
  const [input, setInput] = useState("");
  const [applied, setApplied] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const lines = JSON.stringify(items.map(item => ({ product: item._id, quantity: item.quantity })));
  useEffect(() => {
    const controller = new AbortController();
    async function check() {
      setLoading(true); setError("");
      try {
        const response = await fetch("/api/checkout/quote", { method: "POST", signal: controller.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: JSON.parse(lines), discountCode: applied }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Unable to check prices.");
        setQuote(data);
      } catch (error) { if (!controller.signal.aborted) { setQuote(null); setError(error instanceof Error ? error.message : "Unable to check prices."); } }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    check(); return () => controller.abort();
  }, [lines, applied, revision]);
  function apply(event: FormEvent) { event.preventDefault(); const code = input.trim().toUpperCase(); setApplied(code); onCode(code); setRevision(value => value + 1); }
  return <div className="mt-5 border-t border-[#E7E2DA] pt-5"><form onSubmit={apply}><label htmlFor="discount-code" className="text-sm font-semibold">Have a discount code?</label><div className="mt-3 flex gap-2"><input id="discount-code" value={input} maxLength={40} onChange={event => setInput(event.target.value)} placeholder="Enter code" autoCapitalize="characters" className="min-h-11 w-full min-w-0 rounded-xl border border-[#DDD7CE] px-3 text-sm uppercase" /><button disabled={loading || !input.trim()} className="filter-pill !rounded-xl">Apply</button></div></form>{applied && <button type="button" onClick={() => { setApplied(""); setInput(""); onCode(""); }} className="mt-3 text-xs underline">Remove {applied}</button>}
    {loading ? <p role="status" className="mt-4 animate-pulse text-sm text-[#687169]">Checking current prices…</p> : error ? <div role="alert" className="mt-4 text-sm text-red-700"><p>{error}</p>{!applied && <button type="button" className="mt-2 underline" onClick={() => setRevision(value => value + 1)}>Retry price check</button>}</div> : quote && <div className="mt-5 space-y-3 text-sm" aria-live="polite"><div className="flex justify-between"><span>Subtotal</span><span>₹{quote.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>{quote.discount > 0 && <div className="flex justify-between text-[#52634F]"><span>Savings · {quote.code}</span><span>−₹{quote.discount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>}<div className="flex justify-between border-t border-[#E7E2DA] pt-4 text-lg font-semibold"><span>Pay on delivery</span><span>₹{quote.total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div></div>}
  </div>;
}
