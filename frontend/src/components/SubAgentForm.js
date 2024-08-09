import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const SubAgentForm = ({ masterAgent, onAdd, editAgent }) => {
  // useState hook is used to manage the state for the name, role, and topics of the sub-agent
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [topics, setTopics] = useState('');

  // useEffect hook to populate the form fields if we're editing an existing sub-agent
  useEffect(() => {
    if (editAgent) {
      setName(editAgent.Name); // Set the name field to the sub-agent's current name
      setRole(editAgent.Role); // Set the role field to the sub-agent's current role
      setTopics(editAgent.Topics); // Set the topics field to the sub-agent's current topics
    } else {
      // Clear the form fields if no agent is being edited
      setName('');
      setRole('');
      setTopics('');
    }
  }, [editAgent]);

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Prepare the data to be sent to the backend
      const agentData = {
        masterAgentId: masterAgent.MasterAgentId, // Associate the sub-agent with the selected master agent
        name,
        role,
        topics,
      };
      if (editAgent) {
        // If we're editing an existing sub-agent, send a PUT request with the updated details
        await axios.put(`http://localhost:5001/api/agents/${editAgent.AgentID}`, agentData);
      } else {
        // If we're adding a new sub-agent, send a POST request with the new agent's details
        await axios.post('http://localhost:5001/api/agents', agentData);
      }
      onAdd(); // Call the onAdd function passed as a prop to refresh the agent list and close the form
    } catch (error) {
      console.error(`Error ${editAgent ? 'editing' : 'adding'} agent:`, error); // Log any errors that occur
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Form group for entering the name of the sub-agent */}
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update the name state when the input changes
        />
      </Form.Group>

      {/* Form group for entering the role of the sub-agent */}
      <Form.Group controlId="formRole" className="mt-3">
        <Form.Label>Role</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter role"
          value={role}
          onChange={(e) => setRole(e.target.value)} // Update the role state when the input changes
        />
      </Form.Group>

      {/* Form group for entering the topics of the sub-agent */}
      <Form.Group controlId="formTopics" className="mt-3">
        <Form.Label>Topics</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter topics"
          value={topics}
          onChange={(e) => setTopics(e.target.value)} // Update the topics state when the input changes
        />
      </Form.Group>

      {/* The Avatar upload section is commented out */}
      {/* <Form.Group controlId="formAvatar" className="mt-3">
        <Form.Label>Avatar</Form.Label>
        <Form.Control
          type="file"
          accept="image/*" // Accept only image files
          onChange={handleAvatarChange} // Handle the change in file input
        />
        {avatar && <img src={avatar} alt="Avatar" className="mt-3" style={{ width: '100px', height: '100px' }} />}
      </Form.Group> */}

      {/* Submit button for adding or updating the sub-agent */}
      <Button variant="primary" type="submit" className="mt-3">
        {editAgent ? 'Update Agent' : 'Add Agent'} 
        {/* Display different text based on whether we're adding or editing an agent */}
      </Button>
    </Form>
  );
};

export default SubAgentForm;
