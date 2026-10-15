import { InputError } from "./validation";
import type { Discount } from "@/types/discount";
export function discountFor(code: unknown, subtotal: number, offers: Discount[]): { code: string; discount: number } {
  if (code === undefined || code === null || code === "") return { code: "", discount: 0 };
  if (typeof code !== "string" || code.length > 40) throw new InputError("Enter a valid discount code.");
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { code: "", discount: 0 };
  const offer = offers.find(offer => offer.code === normalized);
  if (!offer || (offer.expiresAt && new Date(offer.expiresAt).getTime() <= Date.now())) throw new InputError("This discount code is invalid or has expired.");
  if (subtotal < offer.minSubtotal) throw new InputError(`Spend at least ₹${offer.minSubtotal} to use ${normalized}.`);
  return { code: normalized, discount: Math.min(subtotal, offer.maxDiscount, Math.round(subtotal * offer.percent) / 100) };
}
export function configuredDiscounts(): Discount[] {
  // Set DISCOUNT_CODES=[] to disable the launch offer, or provide your own offers.
  const offers: unknown = JSON.parse(process.env.DISCOUNT_CODES ?? '[{"code":"CARE10","percent":10,"minSubtotal":499,"maxDiscount":200}]');
  if (!Array.isArray(offers) || offers.some(offer => !offer || typeof offer.code !== "string" || !/^[A-Z0-9_-]{1,40}$/.test(offer.code) || !Number.isFinite(offer.percent) || offer.percent <= 0 || offer.percent > 100 || !Number.isFinite(offer.minSubtotal) || offer.minSubtotal < 0 || !Number.isFinite(offer.maxDiscount) || offer.maxDiscount < 0 || (offer.expiresAt && !Number.isFinite(Date.parse(offer.expiresAt))))) throw new Error("Invalid DISCOUNT_CODES configuration.");
  return offers;
}
