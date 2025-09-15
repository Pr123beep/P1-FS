import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollsAPI } from '../services/api';

function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) { // Limit to 6 options
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) { // Minimum 2 options
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const pollData = {
        question: question.trim(),
        options: validOptions.map(option => option.trim())
      };

      const newPoll = await pollsAPI.createPoll(pollData);
      
      // Redirect to the new poll's detail page
      navigate(`/poll/${newPoll.id}`);
    } catch (err) {
      setError('Failed to create poll. Please try again.');
      console.error('Error creating poll:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '']);
    setError(null);
  };

  return (
    <div className="card">
      <h2>Create a New Poll</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="question">
            Poll Question *
          </label>
          <input
            id="question"
            type="text"
            className="form-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Which JavaScript framework do you prefer?"
            maxLength={200}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Options * (minimum 2, maximum 6)
          </label>
          
          {options.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                className="form-input"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                maxLength={100}
                disabled={loading}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={() => removeOption(index)}
                  disabled={loading}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          {options.length < 6 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addOption}
              disabled={loading}
            >
              + Add Option
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetForm}
            disabled={loading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Poll'}
          </button>
        </div>
      </form>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
        <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Tips:</h4>
        <ul style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          <li>Keep your question clear and concise</li>
          <li>Make sure options are distinct and cover all possibilities</li>
          <li>Consider adding an "Other" option if applicable</li>
        </ul>
      </div>
    </div>
  );
}

export default CreatePoll; 