import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pages/LoginPage.css'; // Import the CSS file

const NewTicketPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const ticketData = { title, description, category: 'other' };

      await axios.post('/api/tickets', ticketData, config);
      setLoading(false);
      navigate('/tickets'); // Redirect to the ticket list on success
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to create ticket.');
    }
  };

  return (
    <div className="form-signin-wrapper">
      <div className="form-signin w-100 m-auto">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a New Ticket
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="form-floating">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-control"
              placeholder="Title"
            />
            <label htmlFor="title">Title</label>
          </div>
          <div className="form-floating">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-control"
              placeholder="Description"
              style={{ height: "120px" }}
            />
            <label htmlFor="description">Description</label>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-100 btn btn-lg btn-primary"
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default NewTicketPage;