import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/users/login', formData);
      login(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-signin-wrapper">
      <div className="form-signin w-100 m-auto">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="form-floating">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-control"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="email-address">Email address</label>
          </div>
          <div className="form-floating">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-control"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-100 btn btn-lg btn-primary"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;