import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function ServiceCard({ service }) {
  return (
    <Link to={`/services/${service._id}`} className="card" style={{ display: 'block' }}>
      <span className="subject-tag">{service.subject}</span>
      <h3 style={{ marginTop: 10 }}>{service.title}</h3>
      <p className="muted" style={{ minHeight: '2.7em', overflow: 'hidden' }}>
        {service.description.slice(0, 90)}
        {service.description.length > 90 ? '…' : ''}
      </p>
      <div className="flex-between" style={{ marginTop: 12 }}>
        <strong>${service.pricePerHour}/hr</strong>
        <StarRating rating={service.averageRating} count={service.reviewCount} />
      </div>
      <p className="muted" style={{ marginTop: 8, marginBottom: 0 }}>
        with {service.tutor?.name || 'a tutor'}
      </p>
    </Link>
  );
}
