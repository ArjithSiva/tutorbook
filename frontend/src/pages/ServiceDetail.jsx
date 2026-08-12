import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({ date: '', durationHours: 1, notes: '' });
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [serviceRes, reviewsRes] = await Promise.all([
        api.get(`/services/${id}`),
        api.get(`/reviews/service/${id}`),
      ]);
      setService(serviceRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBookingChange = (e) => setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });

  const handleBook = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/bookings', {
        serviceId: id,
        date: bookingForm.date,
        durationHours: Number(bookingForm.durationHours),
        notes: bookingForm.notes,
      });
      setMessage({ type: 'success', text: 'Booking request sent! The tutor will confirm it shortly.' });
      setBookingForm({ date: '', durationHours: 1, notes: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not create booking.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container"><p className="muted">Loading…</p></div>;
  if (!service) return <div className="container"><p>Listing not found.</p></div>;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <span className="subject-tag">{service.subject}</span>
      <h1 style={{ marginTop: 12 }}>{service.title}</h1>
      <p className="muted">
        with {service.tutor?.name} &middot; <StarRating rating={service.averageRating} count={service.reviewCount} />
      </p>

      <div style={{ display: 'flex', gap: 32, marginTop: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 300 }}>
          <div className="card">
            <h3>About this lesson</h3>
            <p>{service.description}</p>
            <p><strong>${service.pricePerHour}/hr</strong></p>

            {service.availability?.length > 0 && (
              <>
                <h4>Weekly availability</h4>
                <ul>
                  {service.availability.map((slot, i) => (
                    <li key={i}>{slot.day}: {slot.startTime} – {slot.endTime}</li>
                  ))}
                </ul>
              </>
            )}

            {service.tutor?.bio && (
              <>
                <h4>About {service.tutor.name}</h4>
                <p className="muted">{service.tutor.bio}</p>
              </>
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            <h3>Reviews</h3>
            {reviews.length === 0 && <p className="muted">No reviews yet.</p>}
            {reviews.map((r) => (
              <div key={r._id} className="card" style={{ marginBottom: 12 }}>
                <div className="flex-between">
                  <strong>{r.student?.name}</strong>
                  <StarRating rating={r.rating} />
                </div>
                {r.comment && <p style={{ marginBottom: 0 }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 280 }}>
          <div className="card">
            <h3>Book a lesson</h3>
            {message && <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>{message.text}</div>}

            {user?.role === 'tutor' ? (
              <p className="muted">Tutors can't book lessons. Log in as a student to book.</p>
            ) : (
              <form onSubmit={handleBook}>
                <div className="form-group">
                  <label htmlFor="date">Date & time</label>
                  <input id="date" name="date" type="datetime-local" required value={bookingForm.date} onChange={handleBookingChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="durationHours">Duration (hours)</label>
                  <input id="durationHours" name="durationHours" type="number" min="0.5" step="0.5" required value={bookingForm.durationHours} onChange={handleBookingChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="notes">Notes for the tutor (optional)</label>
                  <textarea id="notes" name="notes" rows={3} value={bookingForm.notes} onChange={handleBookingChange} />
                </div>
                <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
                  {submitting ? 'Booking…' : user ? 'Request booking' : 'Log in to book'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
