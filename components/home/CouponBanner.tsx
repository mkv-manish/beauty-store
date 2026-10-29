"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiCheck, FiCopy } from "react-icons/fi";
import { LeafIcon } from "@/components/ui/BeautyIcons";
import type { Offer } from "@/types/discount";
import styles from "./CouponBanner.module.css";
import ErrorNotice from "@/components/ui/ErrorNotice";
export default function CouponBanner({ offers }: { offers: Offer[] }) {
  const codeField = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState("");
  const offer = offers[0];
  if (!offer) return null;
  const saved = copied === offer.code;
  async function copy() {
    setCopying(true); setError("");
    try { await navigator.clipboard.writeText(offer.code); setCopied(offer.code); }
    catch {
      codeField.current?.focus(); codeField.current?.select();
      setError("Code selected. Press and hold, or use Ctrl/Cmd+C to copy.");
    } finally { setCopying(false); }
  }
  return <section className={styles.shell} aria-labelledby="coupon-title"><div className={styles.banner}>
    <div className={styles.intro}>
      <div className={styles.decoration}><LeafIcon size={200} /></div>
      <span className={styles.kicker}><LeafIcon size={18} /> A little treat from Dermiscaa</span>
      <h2 id="coupon-title">Your daily care.<br /><em>A little more lovely.</em></h2>
      <p>Make room for your skin & hair favourites—with a little saving on us.</p>
      <Link href="/shop" className={styles.shopLink}>Find your essentials <FiArrowUpRight size={18} /></Link>
      <div className={styles.perks}><span>Skin care</span><span>Hair care</span><span>Everyday essentials</span></div>
    </div>
    <div className={styles.ticket}>
      <span className={styles.ticketLabel}>Your beauty bonus</span>
      <p className={styles.saving}>{offer.percent}<span>%<small>OFF</small></span></p>
      <p className={styles.conditions}>On orders of <strong>₹{offer.minSubtotal.toLocaleString("en-IN")}+</strong> · Save up to <strong>₹{offer.maxDiscount.toLocaleString("en-IN")}</strong></p>
      <div className={styles.divider} />
      <label htmlFor="home-offer-code" className={styles.codeLabel}>Use this code at checkout</label>
      <div className={styles.code}><input ref={codeField} id="home-offer-code" type="text" readOnly value={offer.code} aria-label="Discount code" /><button type="button" disabled={copying} onClick={copy} aria-label={`Copy discount code ${offer.code}`}>{saved ? <FiCheck size={18} /> : <FiCopy size={18} />}<span>{copying ? "Copying…" : saved ? "Copied!" : "Copy code"}</span></button></div>
      {error ? <ErrorNotice className="mt-3">{error}</ErrorNotice> : <p className={styles.status} role="status">{saved ? `${offer.code} copied. Your little saving is ready.` : "Copy. Shop. Add a little care to your day."}</p>}
    </div>
  </div></section>;
}
