import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap any page that requires login: <PrivateRoute role="tutor"><CreateService /></PrivateRoute>
// If role is omitted, any logged-in user is allowed through.
export default function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="container"><p className="muted">Loading…</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}
