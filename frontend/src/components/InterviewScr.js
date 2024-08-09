import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import shortid from 'shortid';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import '../styles/InterviewScr.css';

const InterviewScr = () => {
  // State hooks to manage the user's message, conversation responses, session ID, job ID, interview completion status, and modal visibility
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const sessionType = 4;
  const [jobId, setJobId] = useState('');
  const [isCompleted, setIsCompleted] = useState(false); // Track if the interview is completed
  const [showModal, setShowModal] = useState(false); // Track if the completion modal is visible
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const messagesEndRef = useRef(null); // Ref to track the end of messages for auto-scrolling

  // useEffect hook to initialize session and job details when the component first renders
  useEffect(() => {
    // Fetch job details from localStorage
    const jobDetails = JSON.parse(localStorage.getItem('jobDetails')) || {};
    setJobId(jobDetails.jobId || ''); // Set the job ID from the job details

    // Check if a session ID exists in local storage
    let storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      // If no session ID exists, generate a new one and store it
      storedSessionId = shortid.generate();
      localStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId); // Set the session ID state
  }, []);

  // useEffect hook to scroll to the latest message when responses change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll to the last message
  }, [responses]);

  // Function to handle the form submission (sending a message)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const payload = {
      session_id: sessionId, // Include the session ID in the payload
      session_type: sessionType, // Include the session type in the payload
      job_id: jobId, // Include the job ID in the payload
      message: message, // Include the user's message in the payload
    };

    console.log('Sending payload:', payload);

    try {
      // Send the payload to the backend to interact with the interview bot
      const response = await axios.post('http://localhost:5001/api/interview/interact', payload);
      setResponses([...responses, { message: message, response: response.data }]); // Add the user message and bot response to the responses array
      setMessage(''); // Clear the message input field

      // Check if the interview is completed
      if (response.data.interview_status === 'completed') {
        setIsCompleted(true); // Mark the interview as completed
        localStorage.removeItem('sessionId'); // Remove the session ID from localStorage
        setShowModal(true); // Show the completion modal
      }
    } catch (error) {
      console.error('Error sending message:', error); // Log any errors that occur
    }
  };

  // Function to close the completion modal and navigate to the home page
  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    navigate('/'); // Navigate to the Dashboard.js (home page)
  };

  return (
    <div className="container mt-3 interview-container">
      <h2>Interview Screen</h2>
      <div className="chat-box">
        <div className="messages">
          {/* Display the conversation responses (user message and bot response) */}
          {responses.map((resp, index) => (
            <div key={index} className="message-pair">
              <p className="user-message"><strong>You:</strong> {resp.message}</p>
              <p className="bot-response"><strong>Bot:</strong> {resp.response.question}</p>
              <p className="bot-status"><strong>Status:</strong> {resp.response.interview_status}</p>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Ref to ensure the latest message is in view */}
        </div>
        {/* Form to input and submit a new message */}
        <form onSubmit={handleSubmit} className="message-form">
          <textarea
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)} // Update the message state when the input changes
            placeholder="Type your message here"
            disabled={isCompleted} // Disable the textarea if the interview is completed
          ></textarea>
          <button
            type="submit"
            className="btn btn-black mt-3" // Apply custom black button style
            disabled={isCompleted} // Disable the button if the interview is completed
          >
            Send
          </button>
        </form>
      </div>

      {/* Modal to show the interview completion message */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Interview Completed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          The interview is completed. You will now be redirected to the home page.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InterviewScr;
