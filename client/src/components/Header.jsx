import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Header = () => {
  const { userInfo, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="p-3 mb-3 border-bottom bg-light">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none me-lg-auto">
            <span className="fs-4">Smart Helpdesk</span>
          </Link>

          <div className="text-end">
            {userInfo ? (
              <div className="d-flex align-items-center">
                <Link to="/tickets" className="nav-link px-2 link-secondary">My Tickets</Link>
                <span className="px-2">Hello, {userInfo.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger ms-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;