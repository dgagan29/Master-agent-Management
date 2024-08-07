import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const MasterAgentForm = ({ onAdd, agent, formType }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(''); // Changed from 'details' to 'category'
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (formType === 'Edit' && agent) {
      setName(agent.Name);
      setCategory(agent.Category); // Changed from 'Details' to 'Category'
      setAvatar(agent.Avatar || '');
    }
  }, [formType, agent]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 400 * 1024) { // Check file size (< 400 KB)
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file); // Encode image as Base64
    } else {
      alert('File is too large. Please select a file smaller than 400 KB.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formType === 'Add') {
        // Changed from 'details' to 'category'
        await axios.post('http://localhost:5001/api/master-agents', { name, category, avatar });
      } else if (formType === 'Edit' && agent) {
        // Changed from 'details' to 'category'
        await axios.put(`http://localhost:5001/api/master-agents/${agent.MasterAgentId}`, { name, category, avatar });
      }
      onAdd();
    } catch (error) {
      console.error(`Error ${formType === 'Add' ? 'adding' : 'editing'} master agent:`, error);
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

      <Form.Group controlId="formCategory" className="mt-3">
        {/* Changed from 'formDetails' to 'formCategory' */}
        <Form.Label>Category</Form.Label>
        {/* Changed from 'details' to 'category' */}
        <Form.Control
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formAvatar" className="mt-3">
        <Form.Label>Avatar</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />
        {avatar && <img src={avatar} alt="Avatar" className="mt-3" style={{ width: '100px', height: '100px' }} />}
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3">
        {formType === 'Add' ? 'Add Master Agent' : 'Update Master Agent'}
      </Button>
    </Form>
  );
};

export default MasterAgentForm;
