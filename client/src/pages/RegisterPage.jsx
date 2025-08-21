import { useState } from 'react';
import axios from 'axios';
import '../pages/LoginPage.css'; // Import the CSS file

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');
    try {
      await axios.post('/api/users/register', formData);
      setSuccess('Registration successful! You can now log in.');
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
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="form-floating">
            <input
              id="name"
              name="name"
              type="text"
              required
              className="form-control"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="form-floating">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-control"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="email">Email address</label>
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        {success && <p className="mt-2 text-center text-sm text-green-600">{success}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;