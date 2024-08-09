import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const MasterAgentForm = ({ onAdd, agent, formType }) => {
  // useState hook is used to manage the state for the name, category, and avatar of the master agent
  const [name, setName] = useState('');
  const [category, setCategory] = useState(''); // Category of the agent
  const [avatar, setAvatar] = useState(''); // Avatar image for the agent

  // useEffect hook to populate the form fields if we're editing an existing agent
  useEffect(() => {
    if (formType === 'Edit' && agent) {
      setName(agent.Name); // Set the name field to the agent's current name
      setCategory(agent.Category); // Set the category field to the agent's current category
      setAvatar(agent.Avatar || ''); // Set the avatar field to the agent's current avatar, if available
    }
  }, [formType, agent]);

  // Function to handle the change of the avatar file
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file && file.size < 400 * 1024) { // Check if the file size is less than 400 KB
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Set the avatar state to the base64-encoded image
      };
      reader.readAsDataURL(file); // Convert the image to base64 format
    } else {
      alert('File is too large. Please select a file smaller than 400 KB.'); // Show an alert if the file is too large
    }
  };

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      if (formType === 'Add') {
        // If we're adding a new agent, send a POST request with the new agent's details
        await axios.post('http://localhost:5001/api/master-agents', { name, category, avatar });
      } else if (formType === 'Edit' && agent) {
        // If we're editing an existing agent, send a PUT request with the updated details
        await axios.put(`http://localhost:5001/api/master-agents/${agent.MasterAgentId}`, { name, category, avatar });
      }
      onAdd(); // Call the onAdd function passed as a prop to refresh the agent list and close the form
    } catch (error) {
      console.error(`Error ${formType === 'Add' ? 'adding' : 'editing'} master agent:`, error); // Log any errors that occur
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Form group for entering the name of the master agent */}
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update the name state when the input changes
        />
      </Form.Group>

      {/* Form group for entering the category of the master agent */}
      <Form.Group controlId="formCategory" className="mt-3">
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)} // Update the category state when the input changes
        />
      </Form.Group>

      {/* Form group for uploading an avatar for the master agent */}
      <Form.Group controlId="formAvatar" className="mt-3">
        <Form.Label>Avatar</Form.Label>
        <Form.Control
          type="file"
          accept="image/*" // Accept only image files
          onChange={handleAvatarChange} // Handle the change in file input
        />
        {avatar && <img src={avatar} alt="Avatar" className="mt-3" style={{ width: '100px', height: '100px' }} />} 
        {/* Show a preview of the uploaded avatar if available */}
      </Form.Group>

      {/* Submit button for adding or updating the master agent */}
      <Button variant="primary" type="submit" className="mt-3">
        {formType === 'Add' ? 'Add Master Agent' : 'Update Master Agent'} 
        {/* Display different text based on whether we're adding or editing an agent */}
      </Button>
    </Form>
  );
};

export default MasterAgentForm;
