import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/tickets', config);
        setTickets(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tickets.');
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Support Tickets</h1>
        <Link to="/tickets/new">Create New Ticket</Link>
      </div>
      {tickets.length === 0 ? (
        <p>You have not created any tickets yet.</p>
      ) : (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px' }}>Title</th>
              <th style={{ padding: '8px' }}>Category</th>
              <th style={{ padding: '8px' }}>Status</th>
              <th style={{ padding: '8px' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td style={{ padding: '8px' }}><Link to={`/tickets/${ticket._id}`}>{ticket.title}</Link></td> 
                <td style={{ padding: '8px' }}>{ticket.category}</td>
                <td style={{ padding: '8px' }}>{ticket.status}</td>
                <td style={{ padding: '8px' }}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TicketListPage;