import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';
import PollDetail from './components/PollDetail';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="nav">
      <Link 
        to="/" 
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        All Polls
      </Link>
      <Link 
        to="/create" 
        className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`}
      >
        Create Poll
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <h1>QuickPolls</h1>
            <p>Create polls and vote instantly</p>
          </div>
        </header>
        
        <main className="main">
          <div className="container">
            <Navigation />
            <Routes>
              <Route path="/" element={<PollList />} />
              <Route path="/create" element={<CreatePoll />} />
              <Route path="/poll/:id" element={<PollDetail />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App; 