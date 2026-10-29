export default function Loading() {
  return <main className="section-shell min-h-[60vh]" aria-busy="true" aria-label="Loading page"><div className="mb-8 h-9 w-56 animate-pulse rounded-xl bg-[#D9E7E3]" /><div className="product-grid">{Array.from({ length: 4 }, (_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-[#D3E9E5]" />)}</div></main>;
}
