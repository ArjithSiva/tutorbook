export default function StarRating({ rating = 0, count }) {
  const rounded = Math.round(rating);
  return (
    <span className="muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ color: '#f2a93b' }}>
        {'★'.repeat(rounded)}
        {'☆'.repeat(5 - rounded)}
      </span>
      {rating > 0 ? rating.toFixed(1) : 'New'}
      {typeof count === 'number' && count > 0 ? ` (${count})` : ''}
    </span>
  );
}
