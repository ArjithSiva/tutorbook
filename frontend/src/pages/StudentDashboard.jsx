import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function StudentDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewDrafts, setReviewDrafts] = useState({}); // { bookingId: { rating, comment } }
  const [reviewedIds, setReviewedIds] = useState(new Set());
  const [message, setMessage] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/mine');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const setDraft = (bookingId, field, value) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [bookingId]: { rating: 5, comment: '', ...prev[bookingId], [field]: value },
    }));
  };

  const submitReview = async (booking) => {
    const draft = reviewDrafts[booking._id] || { rating: 5, comment: '' };
    setMessage(null);
    try {
      await api.post('/reviews', {
        bookingId: booking._id,
        rating: Number(draft.rating),
        comment: draft.comment,
      });
      setReviewedIds((prev) => new Set(prev).add(booking._id));
      setMessage({ type: 'success', text: 'Review submitted. Thanks for the feedback!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not submit review.' });
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking.');
    }
  };

  if (loading) return <div className="container"><p className="muted">Loading…</p></div>;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <h1>My Bookings</h1>
      {message && <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>{message.text}</div>}

      {bookings.length === 0 && (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>Browse tutors and book your first lesson.</p>
        </div>
      )}

      {bookings.map((b) => {
        const draft = reviewDrafts[b._id] || { rating: 5, comment: '' };
        const alreadyReviewed = reviewedIds.has(b._id);

        return (
          <div key={b._id} className="card" style={{ marginBottom: 12 }}>
            <div className="flex-between">
              <div>
                <strong>{b.service?.title}</strong>
                <p className="muted" style={{ margin: '4px 0' }}>
                  Tutor: {b.tutor?.name} &middot; {new Date(b.date).toLocaleString()} &middot; {b.durationHours}h
                </p>
              </div>
              <span className={`badge badge-${b.status}`}>{b.status}</span>
            </div>

            {b.status === 'pending' && (
              <button className="btn btn-danger" style={{ marginTop: 12 }} onClick={() => cancelBooking(b._id)}>
                Cancel request
              </button>
            )}

            {b.status === 'completed' && !alreadyReviewed && (
              <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <label>Rate this lesson</label>
                <select value={draft.rating} onChange={(e) => setDraft(b._id, 'rating', e.target.value)} style={{ marginBottom: 8 }}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <div className="form-group">
                  <textarea
                    placeholder="Optional comment about the lesson"
                    rows={2}
                    value={draft.comment}
                    onChange={(e) => setDraft(b._id, 'comment', e.target.value)}
                  />
                </div>
                <button className="btn btn-primary" onClick={() => submitReview(b)}>Submit review</button>
              </div>
            )}

            {b.status === 'completed' && alreadyReviewed && (
              <p className="muted" style={{ marginTop: 12, marginBottom: 0 }}>Thanks — your review was submitted.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
