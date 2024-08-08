// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SubAgentList from './components/SubAgentList';
import Demo from './components/Demo';
import InterviewScr from './components/InterviewScr';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sub-agents/:masterAgentId" element={<SubAgentList />} />
          <Route path="/agent-demo/:agentId" element={<Demo />} />
          <Route path="/interview" element={<InterviewScr />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
