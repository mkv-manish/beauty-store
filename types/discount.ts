export type Offer = { code: string; percent: number; minSubtotal: number; maxDiscount: number };
export type Discount = Offer & { expiresAt?: string };
