import type { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement> & { size?: number };
function Base({ size = 24, children, ...props }: Props) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>; }
export function SkinIcon(props: Props) { return <Base {...props}><path d="M9 3h6v4H9zM8 7h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" /><path d="M12 10s-2.5 3-2.5 4.5a2.5 2.5 0 0 0 5 0C14.5 13 12 10 12 10Z" /></Base>; }
export function HairIcon(props: Props) { return <Base {...props}><path d="M9 7V3h7M12 3V1M8 7h8a2 2 0 0 1 2 2v12H6V9a2 2 0 0 1 2-2Z" /><path d="M9 15c4-5 7-1 4 2-3 2-5-1-2-3" /></Base>; }
export function LeafIcon(props: Props) { return <Base {...props}><path d="M20 3C9 2 3 7 5 14c2 7 15 5 15-11Z" /><path d="M4 21c1-6 5-10 11-13" /></Base>; }
export function RitualIcon(props: Props) { return <Base {...props}><path d="M5 12h14v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7ZM4 9h16v3H4zM9 6c0-2 3-2 3-5 3 3 4 5 1 6" /></Base>; }
export function CareIcon(props: Props) { return <Base {...props}><path d="M4 14v6h4l5 1 7-6a2 2 0 0 0-3-1l-4 2H9M8 17h4a2 2 0 0 0 0-4H8l-4 1M12 9C6 5 9 1 12 4c3-3 6 1 0 5Z" /></Base>; }
export function BagIcon(props: Props) { return <Base {...props}><path d="M5 7h14l1 14H4L5 7ZM8 7V5a4 4 0 0 1 8 0v2" /><path d="M15.5 11c-5-.5-7 2-5 4 2 2 5-1 5-4ZM9 17l4-4" /></Base>; }
