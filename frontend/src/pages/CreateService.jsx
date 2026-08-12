import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CreateService() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: '', title: '', description: '', pricePerHour: '' });
  const [slots, setSlots] = useState([{ day: 'Monday', startTime: '15:00', endTime: '17:00' }]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const addSlot = () => setSlots([...slots, { day: 'Monday', startTime: '', endTime: '' }]);
  const removeSlot = (index) => setSlots(slots.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/services', {
        ...form,
        pricePerHour: Number(form.pricePerHour),
        availability: slots.filter((s) => s.startTime && s.endTime),
      });
      navigate('/tutor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 640, paddingTop: 32, paddingBottom: 60 }}>
      <h2>Create a new lesson listing</h2>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" required placeholder="e.g. Algebra" value={form.subject} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="pricePerHour">Price per hour ($)</label>
            <input id="pricePerHour" name="pricePerHour" type="number" min="0" required value={form.pricePerHour} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Listing title</label>
          <input id="title" name="title" required placeholder="e.g. High School Algebra Tutoring" value={form.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} required value={form.description} onChange={handleChange} />
        </div>

        <label>Weekly availability</label>
        {slots.map((slot, i) => (
          <div className="form-row" key={i} style={{ alignItems: 'flex-end' }}>
            <div className="form-group">
              <label>Day</label>
              <select value={slot.day} onChange={(e) => handleSlotChange(i, 'day', e.target.value)}>
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Start</label>
              <input type="time" value={slot.startTime} onChange={(e) => handleSlotChange(i, 'startTime', e.target.value)} />
            </div>
            <div className="form-group">
              <label>End</label>
              <input type="time" value={slot.endTime} onChange={(e) => handleSlotChange(i, 'endTime', e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: '0 0 auto' }}>
              <button type="button" className="btn btn-outline" onClick={() => removeSlot(i)}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-outline" onClick={addSlot} style={{ marginBottom: 20 }}>
          + Add time slot
        </button>

        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? 'Creating…' : 'Publish listing'}
        </button>
      </form>
    </div>
  );
}
