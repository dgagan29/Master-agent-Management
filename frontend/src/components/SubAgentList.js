import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SubAgentForm from './SubAgentForm';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/AddOutlined';
import { Modal } from 'react-bootstrap';
import '../styles/SubAgentList.css';

const SubAgentList = () => {
  const { masterAgentId } = useParams(); // Retrieve masterAgentId from URL parameters
  const [agents, setAgents] = useState([]);
  const [masterAgent, setMasterAgent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editAgent, setEditAgent] = useState(null);

  // Load agents associated with the master agent's category
  const loadAgents = useCallback(async () => {
    try {
      if (masterAgent) {
        const result = await axios.get(`http://localhost:5001/api/agents?category=${masterAgent.Category}`);
        setAgents(result.data);
        console.log('Loaded agents:', result.data);
      }
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  }, [masterAgent]);

  // Load master agent details
  const loadMasterAgent = useCallback(async () => {
    try {
      const result = await axios.get(`http://localhost:5001/api/master-agents/${masterAgentId}`);
      setMasterAgent(result.data);
      console.log('Loaded master agent:', result.data);
    } catch (error) {
      console.error('Error loading master agent:', error);
    }
  }, [masterAgentId]);

  // Close the form modal and reload agents
  const handleCloseForm = () => {
    setShowForm(false);
    loadAgents();
  };

  // Delete an agent by its ID
  const handleDeleteAgent = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/agents/${id}`);
      loadAgents();
      console.log('Deleted agent with ID:', id);
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  // Edit an agent
  const handleEditAgent = (agent) => {
    setEditAgent(agent);
    setShowForm(true);
  };

  // Add an agent
  const handleAddAgent = () => {
    setEditAgent(null);
    setShowForm(true);
  };

  useEffect(() => {
    loadMasterAgent();
  }, [loadMasterAgent]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  return (
    <div className="container mt-3">
      {masterAgent && (
        <>
          <h2>Agents in {masterAgent.Category}</h2>
          <p>{masterAgent.Category}</p>
        </>
      )}
      <div className="instructions-and-add">
        <div className="agent-card add-agent" onClick={handleAddAgent}>
          <div className="card-body">
            <AddIcon className="icon" />
            <p className="add-agent-text">Add New Agent</p>
          </div>
        </div>
        <div className="instructions">
          <h3>Instructions:</h3>
          <p>Click on "Add Agent" to add a new agent. Enter the name and details of the agent.</p>
          <p>You can edit or delete existing agents by clicking the respective icons.</p>
        </div>
      </div>
      <div className="row mt-3">
        {agents.map(agent => (
          <div key={agent.AgentID} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{agent.Role}</h5>
                <p className="card-text">{agent.Topics}</p>
                <p className="card-text"><strong>Agent ID:</strong> {agent.AgentID}</p> {/* Display AgentID */}
                <div className="action-buttons">
                  <EditIcon className="icon edit-icon" onClick={() => handleEditAgent(agent)} />
                  <DeleteIcon className="icon delete-icon" onClick={() => handleDeleteAgent(agent.AgentID)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding/editing Agent */}
      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editAgent ? 'Edit Agent' : 'Add Agent'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SubAgentForm masterAgent={masterAgent} onAdd={handleCloseForm} editAgent={editAgent} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SubAgentList;
