// frontend/src/components/InterviewScr.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import shortid from 'shortid';
import '../styles/InterviewScr.css';

const InterviewScr = () => {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const sessionId = shortid.generate();
  const sessionType = 5;
  
  // Comment out manually assigning a job ID for testing
  // const [jobId, setJobId] = useState('2');
  const [jobId, setJobId] = useState('');
  
  // const [agentRole, setAgentRole] = useState('');
  // const [agentTopic, setAgentTopic] = useState('');
  // const [jd, setJd] = useState('');
  // const [notes, setNotes] = useState('');

  useEffect(() => {
    // Fetch job details from localStorage
    const jobDetails = JSON.parse(localStorage.getItem('jobDetails')) || {};
    setJobId(jobDetails.jobId || '');
    // setAgentRole(jobDetails.agentRole || '');
    // setAgentTopic(jobDetails.agentTopic || '');
    // setJd(jobDetails.jd || '');
    // setNotes(jobDetails.notes || '');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      session_id: sessionId,
      session_type: sessionType,
      job_id: jobId, // Use the job ID retrieved from localStorage
      message: message,
      agent_role: "",  // Keeping other fields as empty strings
      agent_topic: "", // Keeping other fields as empty strings
      jd: "",          // Keeping other fields as empty strings
      notes: ""        // Keeping other fields as empty strings
    };

    console.log('Sending payload:', payload); // Log the payload being sent

    try {
      const response = await axios.post('http://localhost:5001/api/interview/interact', payload);
      setResponses([...responses, { message: message, response: response.data }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container mt-3 interview-container">
      <h2>Interview Screen</h2>
      <div className="chat-box">
        <div className="messages">
          {responses.map((resp, index) => (
            <div key={index} className="message-pair">
              <p className="user-message"><strong>You:</strong> {resp.message}</p>
              <p className="bot-response"><strong>Bot:</strong> {resp.response.question}</p>
              <p className="bot-status"><strong>Status:</strong> {resp.response.interview_status}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="message-form">
          <textarea
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
          ></textarea>
          <button type="submit" className="btn btn-primary mt-3">Send</button>
        </form>
      </div>
    </div>
  );
};

export default InterviewScr;
