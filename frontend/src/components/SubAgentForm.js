import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const SubAgentForm = ({ masterAgent, onAdd, editAgent }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [topics, setTopics] = useState('');

  useEffect(() => {
    if (editAgent) {
      setName(editAgent.Name);
      setRole(editAgent.Role);
      setTopics(editAgent.Topics);
    } else {
      setName('');
      setRole('');
      setTopics('');
    }
  }, [editAgent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const agentData = {
        masterAgentId: masterAgent.MasterAgentId,
        name,
        role,
        topics,
      };
      if (editAgent) {
        await axios.put(`http://localhost:5001/api/agents/${editAgent.AgentID}`, agentData);
      } else {
        await axios.post('http://localhost:5001/api/agents', agentData);
      }
      onAdd();
    } catch (error) {
      console.error(`Error ${editAgent ? 'editing' : 'adding'} agent:`, error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formRole" className="mt-3">
        <Form.Label>Role</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formTopics" className="mt-3">
        <Form.Label>Topics</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter topics"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
        />
      </Form.Group>
        {/* Commenting out Avatar */}
      {/* <Form.Group controlId="formAvatar" className="mt-3">
        <Form.Label>Avatar</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />
        {avatar && <img src={avatar} alt="Avatar" className="mt-3" style={{ width: '100px', height: '100px' }} />}
      </Form.Group> */}

      <Button variant="primary" type="submit" className="mt-3">
        {editAgent ? 'Update Agent' : 'Add Agent'}
      </Button>
    </Form>
  );
};

export default SubAgentForm;
