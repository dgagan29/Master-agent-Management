import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const SubAgentForm = ({ masterAgent, onAdd, editAgent, formType }) => {
  const [role, setRole] = useState('');
  const [topics, setTopics] = useState('');
  const [avatar, setAvatar] = useState('');
  const [show, setShow] = useState(false); // Initialize show state

  useEffect(() => {
    if (formType === 'Edit' && editAgent) {
      setRole(editAgent.Role);
      setTopics(editAgent.Topics);
      setAvatar(editAgent.Avatar || '');
    }
  }, [formType, editAgent]);

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
        await axios.post('http://localhost:5001/api/agents', {
          category: masterAgent.Category,
          role,
          topics,
          avatar,
        });
      } else if (formType === 'Edit' && editAgent) {
        await axios.put(`http://localhost:5001/api/agents/${editAgent.AgentID}`, {
          role,
          topics,
          avatar,
        });
      }
      onAdd();
      setRole('');
      setTopics('');
      handleClose();
    } catch (error) {
      console.error(`Error ${formType === 'Add' ? 'adding' : 'editing'} agent:`, error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {formType === 'Add' ? 'Add Agent' : 'Update Agent'}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formType === 'Add' ? 'Add Agent' : 'Update Agent'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formRole">
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

            <Form.Group controlId="formAvatar" className="mt-3">
              <Form.Label>Avatar</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {formType === 'Add' ? 'Add Agent' : 'Update Agent'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SubAgentForm;
