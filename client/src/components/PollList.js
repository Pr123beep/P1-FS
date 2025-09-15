import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pollsAPI } from '../services/api';

function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const data = await pollsAPI.getPolls();
      setPolls(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch polls. Please try again.');
      console.error('Error fetching polls:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalVotes = (options) => {
    return options.reduce((total, option) => total + option.votes, 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading polls...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button 
          className="btn btn-secondary btn-small" 
          onClick={fetchPolls}
          style={{ marginLeft: '1rem' }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="empty-state">
        <h3>No polls yet</h3>
        <p>Be the first to create a poll!</p>
        <Link to="/create" className="btn btn-primary">
          Create Your First Poll
        </Link>
      </div>
    );
  }

  return (
    <div className="poll-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>All Polls ({polls.length})</h2>
        <button 
          className="btn btn-secondary btn-small" 
          onClick={fetchPolls}
          title="Refresh polls"
        >
          Refresh
        </button>
      </div>
      
      {polls.map((poll) => (
        <Link 
          key={poll.id} 
          to={`/poll/${poll.id}`} 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="card poll-card">
            <h3 className="poll-question">{poll.question}</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              {poll.options.map((option, index) => (
                <div key={index} className="poll-option">
                  <span>{option.text}</span>
                  <span style={{ fontWeight: 'bold', color: '#667eea' }}>
                    {option.votes} votes
                  </span>
                </div>
              ))}
            </div>
            
            <div className="poll-meta">
              <span>{getTotalVotes(poll.options)} total votes</span>
              <span>Created {formatDate(poll.createdAt)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default PollList; 