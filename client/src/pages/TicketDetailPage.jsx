import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TicketDetailPage = () => {
  const [ticket, setTicket] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Gets the ticket ID from the URL

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get(`/api/tickets/${id}`, config);
        setTicket(data.ticket);
        setAuditLogs(data.auditLogs);
        setLoading(false);
      } catch {
        setError('Failed to fetch ticket details.');
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) return <p>Loading ticket details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!ticket) return <p>Ticket not found.</p>;

  return (
    <div>
      <h2>Ticket: {ticket.title}</h2>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Category:</strong> {ticket.category}</p>
      <p><strong>Description:</strong> {ticket.description}</p>

      {ticket.agentSuggestionId && (
        <div style={{ marginTop: '2rem', background: '#f0f0f0', padding: '1rem' }}>
          <h3>AI Agent Suggestion</h3>
          <p><strong>Suggested Reply:</strong></p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{ticket.agentSuggestionId.draftReply}</pre>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Ticket History (Audit Log)</h3>
        <ul>
          {auditLogs.map((log) => (
            <li key={log._id}>
              {new Date(log.timestamp).toLocaleString()} - <strong>{log.action}</strong> by {log.actor}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TicketDetailPage;