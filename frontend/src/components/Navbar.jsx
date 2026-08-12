import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="brand">
          Tutor<span>Book</span>
        </Link>
        <nav>
          <Link to="/">Browse</Link>

          {!user && (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}

          {user && user.role === 'tutor' && (
            <>
              <Link to="/tutor/dashboard">My Listings</Link>
              <Link to="/tutor/services/new">+ New Listing</Link>
            </>
          )}

          {user && user.role === 'student' && <Link to="/student/dashboard">My Bookings</Link>}

          {user && (
            <button className="link" onClick={handleLogout}>
              Log out ({user.name.split(' ')[0]})
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
