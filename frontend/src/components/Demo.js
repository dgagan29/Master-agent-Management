import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Demo.css'; // Import the updated CSS file

const Demo = () => {
  const { agentId } = useParams(); // Get the agentId from the URL parameters
  const [agent, setAgent] = useState(null); // State to store the agent's data
  const [jobDescription, setJobDescription] = useState(''); // State to store the job description input
  const [hrNotes, setHrNotes] = useState(''); // State to store the HR notes input
  const navigate = useNavigate(); // Hook to handle navigation

  // useEffect hook to fetch the agent's data when the component first renders or when agentId changes
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/agents/${agentId}`);
        setAgent(response.data); // Store the fetched agent details in state
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

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const jobId = generateRandomInteger(1, 100000).toString(); // Generate a random job ID

    // Prepare the payload to be sent to the backend
    const payload = {
      agentId: agentId,
      hrNotes: hrNotes,
      jobDescription: jobDescription,
      jobId: jobId,
    };

    try {
      // Send the payload to the backend to create a new job entry
      await axios.post('http://localhost:5001/api/jobs', payload);
      console.log('Job added:', payload);

      // Store job details in localStorage to be used in the next page
      const jobDetails = {
        jobId: jobId,
        agentRole: agent.Role,
        agentTopic: agent.Topics,
        jd: jobDescription,
        notes: hrNotes,
      };
      localStorage.setItem('jobDetails', JSON.stringify(jobDetails)); // Save the job details to localStorage

      // Navigate to the interview page after successful submission
      navigate('/interview');
    } catch (error) {
      console.error('Error adding job:', error); // Log any errors that occur
    }
  };

  return (
    <div className="demo-container">
      {/* Render the agent's demo information if the agent data has been loaded */}
      {agent ? (
        <>
          <h2>Demo for Agent: {agent.Role}</h2>
          <p><strong>Category:</strong> {agent.Category}</p>
          <p><strong>Agent ID:</strong> {agentId}</p>
          <form onSubmit={handleSubmit} className="demo-form">
            {/* Form group for entering the job description */}
            <div className="form-group">
              <label htmlFor="jobDescription">Job Description</label>
              <textarea
                id="jobDescription"
                className="form-control"
                placeholder="Add job description here"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)} // Update the jobDescription state when the input changes
              ></textarea>
            </div>
            {/* Form group for entering HR notes */}
            <div className="form-group">
              <label htmlFor="hrNotes">HR Notes</label>
              <textarea
                id="hrNotes"
                className="form-control"
                placeholder="Add HR notes here"
                value={hrNotes}
                onChange={(e) => setHrNotes(e.target.value)} // Update the hrNotes state when the input changes
              ></textarea>
            </div>
            {/* Submit button to submit the form */}
            <button type="submit" className="btn-submit">Submit</button>
          </form>
        </>
      ) : (
        <p>Loading...</p> // Show a loading message if the agent data is still being fetched
      )}
    </div>
  );
};

export default Demo;
