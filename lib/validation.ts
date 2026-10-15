export class InputError extends Error {}
export function text(value: unknown, label: string, max = 200) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new InputError(`${label} is required and must be at most ${max} characters.`);
  return value.trim();
}
export function phone(value: unknown) {
  const result = text(value, "Mobile number", 10);
  if (!/^[6-9]\d{9}$/.test(result)) throw new InputError("Enter a valid 10-digit Indian mobile number.");
  return result;
}
export function email(value: unknown) {
  const result = text(value, "Email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new InputError("Enter a valid email address.");
  return result;
}
export function password(value: unknown) {
  if (typeof value !== "string" || value.length < 8 || new TextEncoder().encode(value).length > 72) throw new InputError("Password must be at least 8 characters and at most 72 bytes.");
  return value;
}
export function cartLines(value: unknown) {
  if (!Array.isArray(value) || !value.length || value.length > 100) throw new InputError("Your cart must contain between 1 and 100 items.");
  const lines = new Map<string, number>();
  for (const item of value) {
    if (!item || typeof item !== "object") throw new InputError("Invalid cart item.");
    const id = item.product ?? item.productId;
    if (typeof id !== "string" || !/^[a-f0-9]{24}$/i.test(id)) throw new InputError("Invalid product ID.");
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 1000) throw new InputError("Quantity must be a whole number between 1 and 1000.");
    const key = id.toLowerCase();
    const quantity = (lines.get(key) ?? 0) + item.quantity;
    if (quantity > 1000) throw new InputError("Quantity cannot exceed 1000 per product.");
    lines.set(key, quantity);
  }
  return [...lines].map(([product, quantity]) => ({ product, quantity }));
}
