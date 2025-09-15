import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pollsAPI } from '../services/api';

function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      const data = await pollsAPI.getPoll(id);
      setPoll(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch poll. Please try again.');
      console.error('Error fetching poll:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (optionIndex) => {
    try {
      setVoting(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await pollsAPI.vote(id, optionIndex);
      setPoll(response.poll);
      setSuccessMessage('Vote recorded successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to record vote. Please try again.');
      }
      console.error('Error voting:', err);
    } finally {
      setVoting(false);
    }
  };

  const getTotalVotes = () => {
    if (!poll) return 0;
    return poll.options.reduce((total, option) => total + option.votes, 0);
  };

  const getVotePercentage = (votes) => {
    const total = getTotalVotes();
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading poll...</div>;
  }

  if (error && !poll) {
    return (
      <div>
        <div className="error">
          {error}
          <button 
            className="btn btn-secondary btn-small" 
            onClick={fetchPoll}
            style={{ marginLeft: '1rem' }}
          >
            Retry
          </button>
        </div>
        <Link to="/" className="btn btn-secondary">
          ← Back to All Polls
        </Link>
      </div>
    );
  }

  if (!poll) {
    return (
      <div>
        <div className="error">Poll not found</div>
        <Link to="/" className="btn btn-secondary">
          ← Back to All Polls
        </Link>
      </div>
    );
  }

  const totalVotes = getTotalVotes();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" className="btn btn-secondary">
          ← Back to All Polls
        </Link>
      </div>

      <div className="card">
        <h1 className="poll-question">{poll.question}</h1>
        
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
        
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Total votes: <strong>{totalVotes}</strong> • 
            Created {formatDate(poll.createdAt)}
          </p>
          
          <button 
            className="btn btn-secondary btn-small" 
            onClick={fetchPoll}
            disabled={voting}
            title="Refresh results"
          >
            Refresh Results
          </button>
        </div>

        {/* Voting Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Cast Your Vote</h3>
          {poll.options.map((option, index) => (
            <button
              key={index}
              className="vote-button"
              onClick={() => handleVote(index)}
              disabled={voting}
              style={{
                opacity: voting ? 0.6 : 1,
                cursor: voting ? 'not-allowed' : 'pointer'
              }}
            >
              {option.text}
              {voting && <span> (Voting...)</span>}
            </button>
          ))}
        </div>

        {/* Results Section */}
        <div>
          <h3 style={{ marginBottom: '1.5rem', color: '#374151' }}>Live Results</h3>
          {poll.options.map((option, index) => {
            const percentage = getVotePercentage(option.votes);
            return (
              <div key={index} style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontWeight: '600' }}>{option.text}</span>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    {option.votes} votes ({percentage}%)
                  </span>
                </div>
                <div className="results-bar">
                  <div 
                    className="results-fill"
                    style={{ 
                      width: `${percentage}%`,
                      minWidth: percentage > 0 ? '30px' : '0px'
                    }}
                  >
                    {percentage > 10 && `${percentage}%`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalVotes === 0 && (
          <div className="empty-state" style={{ marginTop: '2rem' }}>
            <h4>No votes yet</h4>
            <p>Be the first to vote on this poll!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PollDetail; 