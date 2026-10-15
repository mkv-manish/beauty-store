"use client";
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
  return <section id="reviews" className="reviews-section"><div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E7E2DA] pb-5"><div><p className="eyebrow">From the community</p><h2 className="section-title mt-2">Ratings & reviews</h2></div>{!!data?.count && <p className="flex items-center gap-2 text-sm"><FiStar fill="currentColor" className="text-[#52634F]" />{data.rating.toFixed(1)} / 5 · {data.count} review{data.count === 1 ? "" : "s"}</p>}</div>
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]"><div>
      {loading ? <div aria-label="Loading reviews" aria-busy="true" className="space-y-4"><div className="h-28 animate-pulse rounded-2xl bg-[#EDE8E0]" /><div className="h-28 animate-pulse rounded-2xl bg-[#EDE8E0]" /></div> : error ? <div role="alert" className="empty-panel"><p>{error}</p><button className="secondary-link mt-4" onClick={() => setRevision(value => value + 1)}>Try again</button></div> : !data?.count ? <div className="rounded-2xl bg-[#F0F2E9] p-6"><FiStar size={24} /><h3 className="mt-3 font-semibold">Be the first to share your experience</h3><p className="mt-2 text-sm leading-6 text-[#687169]">Your honest thoughts can help someone find their next everyday essential.</p></div> : <><div className="space-y-4">{data.reviews.map(review => <article key={review._id} className="rounded-2xl border border-[#E7E2DA] bg-white p-5"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{review.name}</h3><span className="text-xs text-[#687169]">{new Date(review.createdAt).toLocaleDateString("en-IN")}</span></div><p className="mt-2 text-sm text-[#52634F]" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#687169]">{review.comment}</p></article>)}</div>{data.pages > 1 && <div className="mt-5 flex items-center gap-4"><button className="filter-pill" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><span className="text-sm">{page} / {data.pages}</span><button className="filter-pill" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button></div>}</>}
    </div><form onSubmit={submit} className="h-fit rounded-2xl border border-[#E7E2DA] bg-white p-5"><h3 className="text-lg font-semibold">Share a little care</h3><p className="mt-2 text-xs leading-6 text-[#687169]">Sign in to post. One review per product; posting again updates your review.</p><label className="mt-4 block text-sm" htmlFor="review-rating">Your rating</label><select id="review-rating" value={rating} onChange={event => setRating(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-[#DDD7CE] bg-white px-3">{[5,4,3,2,1].map(value => <option key={value} value={value}>{value} star{value === 1 ? "" : "s"}</option>)}</select><label className="mt-4 block text-sm" htmlFor="review-comment">Your review</label><textarea id="review-comment" required maxLength={1000} rows={4} value={comment} onChange={event => setComment(event.target.value)} placeholder="What did you like about this product?" className="mt-2 w-full resize-y rounded-xl border border-[#DDD7CE] p-3 text-sm" /><p className="mt-1 text-right text-xs text-[#687169]">{comment.length}/1000</p>{saveError && <p role="alert" className="mt-3 text-sm text-red-700">{saveError} {signIn && <Link href={`/login?next=${encodeURIComponent(`/product/${id}`)}`} className="underline">Sign in</Link>}</p>}{message && <p role="status" className="mt-3 text-sm text-[#52634F]">{message}</p>}<button disabled={saving} className="primary-link mt-4 w-full">{saving ? "Saving…" : "Post review"}</button></form></div>
  </section>;
}
