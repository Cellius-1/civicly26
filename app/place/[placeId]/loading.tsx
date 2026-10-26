export default function Loading() {
  return (
    <div className="stack" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading records</span>
      <div className="screen__head">
        <span className="skeleton" style={{ width: '40%' }} />
        <span className="skeleton skeleton--title" />
        <span className="skeleton" style={{ width: '85%' }} />
      </div>
      <span className="skeleton skeleton--card" />
      <span className="skeleton skeleton--card" />
      <span className="skeleton skeleton--card" />
    </div>
  )
}
