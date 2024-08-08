import React, { useState, useEffect } from 'react';
import axios from 'axios';
import shortid from 'shortid';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../styles/InterviewScr.css';

const InterviewScr = () => {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const sessionType = 5;
  const [jobId, setJobId] = useState('');
  const [isCompleted, setIsCompleted] = useState(false); // State to track if the interview is completed
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch job details from localStorage
    const jobDetails = JSON.parse(localStorage.getItem('jobDetails')) || {};
    setJobId(jobDetails.jobId || '');

    // Check if a session ID exists in local storage
    let storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      // If no session ID exists, generate a new one and store it
      storedSessionId = shortid.generate();
      localStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      session_id: sessionId,
      session_type: sessionType,
      job_id: jobId,
      message: message,
    };

    console.log('Sending payload:', payload);

    try {
      const response = await axios.post('http://localhost:5001/api/interview/interact', payload);
      setResponses([...responses, { message: message, response: response.data }]);
      setMessage('');

      if (response.data.interview_status === 'completed') {
        setIsCompleted(true);
        localStorage.removeItem('sessionId');
        showCompletionPopup(); // Call the function to show the popup and navigate
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const showCompletionPopup = () => {
    const continueInterview = window.confirm('The interview is completed. Do you want to start another interview?');
    if (continueInterview) {
      navigate('/'); // Navigate to the Dashboard.js (home page)
    } else {
      navigate('/'); // Navigate to the Dashboard.js (home page)
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
            disabled={isCompleted} // Disable the textarea if the interview is completed
          ></textarea>
          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={isCompleted} // Disable the button if the interview is completed
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterviewScr;
