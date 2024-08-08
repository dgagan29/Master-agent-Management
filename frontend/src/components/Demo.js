// frontend/src/components/Demo.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Demo.css'; // Import the CSS file

const Demo = () => {
  const { agentId } = useParams();
  const [agent, setAgent] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [hrNotes, setHrNotes] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/agents/${agentId}`);
        setAgent(response.data);
      } catch (error) {
        console.error('Error fetching agent data:', error);
      }
    };

    fetchAgent();
  }, [agentId]);

  // Function to generate a random integer within a specified range
  const generateRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobId = generateRandomInteger(1, 100000).toString(); // Generate the job ID as an integer and convert to string
    const payload = {
      agentId: agentId,
      hrNotes: hrNotes,
      jobDescription: jobDescription,
      jobId: jobId // Include the job ID in the payload
    };

    try {
      await axios.post('http://localhost:5001/api/jobs', payload);
      console.log('Job added:', payload);
      const jobDetails = {
        jobId: jobId,
        agentRole: agent.Role,
        agentTopic: agent.Topics,
        jd: jobDescription,
        notes: hrNotes,
      };
      localStorage.setItem('jobDetails', JSON.stringify(jobDetails));
      navigate('/interview');
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  return (
    <div className="container mt-3">
      {agent ? (
        <>
          <h2>Demo for Agent: {agent.Role}</h2>
          <p><strong>Category:</strong> {agent.Category}</p>
          <p><strong>Agent ID:</strong> {agentId}</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Description</label>
              <textarea
                className="form-control"
                placeholder="Add job description here"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group mt-3">
              <label>HR Notes</label>
              <textarea
                className="form-control"
                placeholder="Add HR notes here"
                value={hrNotes}
                onChange={(e) => setHrNotes(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Submit</button>
          </form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Demo;
