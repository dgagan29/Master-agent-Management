import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SubAgentList from './components/SubAgentList';
import Navbar from './components/Navbar'; // Import the Navbar component
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar /> {/* Add the Navbar component here */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sub-agents/:masterAgentId" element={<SubAgentList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
