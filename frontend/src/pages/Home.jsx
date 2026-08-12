import { useEffect, useState } from 'react';
import api from '../api/axios';
import ServiceCard from '../components/ServiceCard';

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ subject: '', minPrice: '', maxPrice: '' });

  const fetchServices = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/services', { params });
      setServices(res.data);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (filters.subject) params.subject = filters.subject;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    fetchServices(params);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Find the right tutor for you</h1>
        <p className="muted">Browse lessons by subject, or search for exactly what you need.</p>
      </div>

      <form onSubmit={handleSearch} className="card" style={{ marginBottom: 32 }}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" placeholder="e.g. Algebra, Spanish, Piano" value={filters.subject} onChange={handleFilterChange} />
          </div>
          <div className="form-group">
            <label htmlFor="minPrice">Min $/hr</label>
            <input id="minPrice" name="minPrice" type="number" min="0" value={filters.minPrice} onChange={handleFilterChange} />
          </div>
          <div className="form-group">
            <label htmlFor="maxPrice">Max $/hr</label>
            <input id="maxPrice" name="maxPrice" type="number" min="0" value={filters.maxPrice} onChange={handleFilterChange} />
          </div>
        </div>
        <button className="btn btn-primary" type="submit">Search</button>
      </form>

      {loading && <p className="muted">Loading listings…</p>}

      {!loading && services.length === 0 && (
        <div className="empty-state">
          <h3>No listings match yet</h3>
          <p>Try clearing your filters, or check back soon — new tutors join often.</p>
        </div>
      )}

      <div className="grid">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
}
