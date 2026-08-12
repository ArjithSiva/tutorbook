import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StarRating from '../components/StarRating';

export default function TutorDashboard() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [servicesRes, bookingsRes] = await Promise.all([
        api.get('/services/mine'),
        api.get('/bookings/mine'),
      ]);
      setServices(servicesRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update booking.');
    }
  };

  const deleteService = async (serviceId) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await api.delete(`/services/${serviceId}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete listing.');
    }
  };

  if (loading) return <div className="container"><p className="muted">Loading…</p></div>;

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div className="flex-between page-header">
        <h1 style={{ marginBottom: 0 }}>My Listings</h1>
        <Link to="/tutor/services/new" className="btn btn-primary">+ New Listing</Link>
      </div>

      {services.length === 0 && (
        <div className="empty-state">
          <h3>You haven't published any listings yet</h3>
          <p>Create your first listing so students can find and book you.</p>
        </div>
      )}

      <div className="grid" style={{ marginBottom: 48 }}>
        {services.map((s) => (
          <div key={s._id} className="card">
            <span className="subject-tag">{s.subject}</span>
            <h3 style={{ marginTop: 10 }}>{s.title}</h3>
            <div className="flex-between">
              <strong>${s.pricePerHour}/hr</strong>
              <StarRating rating={s.averageRating} count={s.reviewCount} />
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Link to={`/services/${s._id}`} className="btn btn-outline">View</Link>
              <button className="btn btn-danger" onClick={() => deleteService(s._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <h2>Booking Requests</h2>
      {bookings.length === 0 && <p className="muted">No bookings yet.</p>}
      {bookings.map((b) => (
        <div key={b._id} className="card" style={{ marginBottom: 12 }}>
          <div className="flex-between">
            <div>
              <strong>{b.service?.title}</strong>
              <p className="muted" style={{ margin: '4px 0' }}>
                Student: {b.student?.name} &middot; {new Date(b.date).toLocaleString()} &middot; {b.durationHours}h
              </p>
              {b.notes && <p className="muted" style={{ margin: 0 }}>Note: {b.notes}</p>}
            </div>
            <span className={`badge badge-${b.status}`}>{b.status}</span>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            {b.status === 'pending' && (
              <>
                <button className="btn btn-primary" onClick={() => updateStatus(b._id, 'confirmed')}>Confirm</button>
                <button className="btn btn-danger" onClick={() => updateStatus(b._id, 'cancelled')}>Decline</button>
              </>
            )}
            {b.status === 'confirmed' && (
              <button className="btn btn-primary" onClick={() => updateStatus(b._id, 'completed')}>Mark Completed</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
