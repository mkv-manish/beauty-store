"use client";
import ErrorNotice from "@/components/ui/ErrorNotice";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { FiStar } from "react-icons/fi";
type Review = { _id: string; name: string; rating: number; comment: string; createdAt: string };
type Data = { reviews: Review[]; rating: number; count: number; pages: number };
export default function ProductReviews({ id }: { id: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [signIn, setSignIn] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError("");
      try {
        const response = await fetch(`/api/products/${id}/reviews?page=${page}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load reviews.");
        setData(await response.json());
      } catch { if (!controller.signal.aborted) setError("Unable to load reviews. Please try again."); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load(); return () => controller.abort();
  }, [id, page, revision]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setSaveError(""); setMessage(""); setSignIn(false);
    try {
      const response = await fetch(`/api/products/${id}/reviews`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating: Number(rating), comment }) });
      const result = await response.json();
      if (response.status === 401) setSignIn(true);
      if (!response.ok) throw new Error(result.message ?? "Unable to save review.");
      setMessage("Thank you. Your review has been saved."); setComment(""); setPage(1); setRevision(value => value + 1);
    } catch (error) { setSaveError(error instanceof Error ? error.message : "Unable to save review."); }
    finally { setSaving(false); }
  }
  return <section id="reviews" className="reviews-section"><div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#D9E7E3] pb-5"><div><p className="eyebrow">From the community</p><h2 className="section-title mt-2">Ratings & reviews</h2></div>{!!data?.count && <p className="flex items-center gap-2 text-sm"><FiStar fill="currentColor" className="text-[#287C78]" />{data.rating.toFixed(1)} / 5 · {data.count} review{data.count === 1 ? "" : "s"}</p>}</div>
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]"><div>
      {loading ? <div aria-label="Loading reviews" aria-busy="true" className="space-y-4"><div className="h-28 animate-pulse rounded-2xl bg-[#D3E9E5]" /><div className="h-28 animate-pulse rounded-2xl bg-[#D3E9E5]" /></div> : error ? <ErrorNotice title="Reviews couldn’t load" action={<button type="button" onClick={() => setRevision(value => value + 1)}>Try again</button>}>{error}</ErrorNotice> : !data?.count ? <div className="rounded-2xl bg-[#EFF7F5] p-6"><FiStar size={24} /><h3 className="mt-3 font-semibold">Be the first to share your experience</h3><p className="mt-2 text-sm leading-6 text-[#617B78]">Your honest thoughts can help someone find their next everyday essential.</p></div> : <><div className="space-y-4">{data.reviews.map(review => <article key={review._id} className="rounded-2xl border border-[#D9E7E3] bg-white p-5"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{review.name}</h3><span className="text-xs text-[#617B78]">{new Date(review.createdAt).toLocaleDateString("en-IN")}</span></div><p className="mt-2 text-sm text-[#287C78]" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#617B78]">{review.comment}</p></article>)}</div>{data.pages > 1 && <div className="mt-5 flex items-center gap-4"><button className="filter-pill" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><span className="text-sm">{page} / {data.pages}</span><button className="filter-pill" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button></div>}</>}
    </div><form onSubmit={submit} className="h-fit rounded-2xl border border-[#D9E7E3] bg-white p-5"><h3 className="text-lg font-semibold">Share a little care</h3><p className="mt-2 text-xs leading-6 text-[#617B78]">Sign in to post. One review per product; posting again updates your review.</p><label className="mt-4 block text-sm" htmlFor="review-rating">Your rating</label><select id="review-rating" value={rating} onChange={event => setRating(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-[#D9E7E3] bg-white px-3">{[5,4,3,2,1].map(value => <option key={value} value={value}>{value} star{value === 1 ? "" : "s"}</option>)}</select><label className="mt-4 block text-sm" htmlFor="review-comment">Your review</label><textarea id="review-comment" required maxLength={1000} rows={4} value={comment} onChange={event => setComment(event.target.value)} placeholder="What did you like about this product?" className="mt-2 w-full resize-y rounded-xl border border-[#D9E7E3] p-3 text-sm" /><p className="mt-1 text-right text-xs text-[#617B78]">{comment.length}/1000</p>{saveError && <ErrorNotice className="mt-3" action={signIn ? <Link href={`/login?next=${encodeURIComponent(`/product/${id}`)}`}>Sign in</Link> : undefined}>{saveError}</ErrorNotice>}{message && <p role="status" className="mt-3 text-sm text-[#287C78]">{message}</p>}<button disabled={saving} className="primary-link mt-4 w-full">{saving ? "Saving…" : "Post review"}</button></form></div>
  </section>;
}
