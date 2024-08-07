import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Demo.css';

const Demo = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [hrNotes, setHrNotes] = useState('');
  const [jobDescription, setJobDescription] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        agentId,
        hrNotes,
        jobDescription,
      };
      await axios.post('http://localhost:5001/api/jobs', jobData);
      console.log('Data submitted:', jobData);
      setHrNotes('');
      setJobDescription('');
      alert('Job data submitted successfully');
      navigate('/interview-scr');
    } catch (error) {
      console.error('Error submitting job data:', error);
    }
  };

  return (
    <div className="demo-container">
      {agent ? (
        <>
          <div className="agent-info">
            <p><strong>Category:</strong> {agent.Category}</p>
            <p><strong>Agent ID:</strong> {agent.AgentID}</p>
            <h2>Demo for Agent: {agent.Role}</h2>
          </div>
          <form onSubmit={handleSubmit} className="demo-form">
            <div className="form-group">
              <label htmlFor="jobDescription">Job Description</label>
              <textarea
                id="jobDescription"
                className="form-control"
                placeholder="Add job description here"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="hrNotes">HR Notes</label>
              <textarea
                id="hrNotes"
                className="form-control"
                placeholder="Add HR notes here"
                value={hrNotes}
                onChange={(e) => setHrNotes(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">Submit</button>
          </form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Demo;
