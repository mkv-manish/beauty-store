/** Shared catalogue configuration: navigation, filters, types and database enum. */
export const categories = [
  { id: "skin", label: "Skin Care", headline: "Your skin. Your ritual.", icon: "skin" },
  { id: "hair", label: "Hair Care", headline: "Good hair days start here.", icon: "hair" },
] as const;
export type CategoryId = (typeof categories)[number]["id"];
export const categoryIds: readonly string[] = categories.map(category => category.id);
export function isCategory(value: unknown): value is CategoryId { return typeof value === "string" && categoryIds.includes(value); }
export function categoryLabel(id: string) { return categories.find(category => category.id === id)?.label ?? "Everyday care"; }
