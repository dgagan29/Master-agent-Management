import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MasterAgentForm from './MasterAgentForm';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/AddOutlined';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // useState hook is used to manage the state of master agents, form visibility, and the agent being edited
  const [masterAgents, setMasterAgents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editAgent, setEditAgent] = useState(null);

  // useEffect hook to load the master agents when the component first renders
  useEffect(() => {
    loadMasterAgents();
  }, []);

  // Function to fetch master agents from the server using axios
  const loadMasterAgents = async () => {
    try {
      const result = await axios.get('http://localhost:5001/api/master-agents');
      setMasterAgents(result.data.Items || []); // Set the fetched agents into state
    } catch (error) {
      console.error('Error loading master agents:', error);
    }
  };

  // Function to show the form modal, optionally with an agent to edit
  const handleShowForm = (agent = null) => {
    setEditAgent(agent); // Set the agent being edited, if any
    setShowForm(true); // Show the form
  };

  // Function to close the form modal and reload the agents
  const handleCloseForm = () => {
    setShowForm(false); // Hide the form
    loadMasterAgents(); // Reload the list of agents
  };

  // Function to delete an agent by its ID
  const handleDeleteAgent = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/master-agents/${id}`);
      loadMasterAgents(); // Reload the list after deletion
    } catch (error) {
      console.error('Error deleting master agent:', error);
    }
  };

  return (
    <div className="dashboard-container mt-5">
      <div className="header-section">
        <div className="create-agent-section">
          <h2>Create your first agent</h2>
          <p>Craft a unique AI agent of your own by uploading your data and effortlessly customizing its appearance and personality</p>
        </div>
      </div>
      <div className="main-section">
        <h1>Dashboard</h1>
        <div className="instructions-and-add">
          {/* Button to show the form for adding a new master agent */}
          <div className="agent-card add-master-agent" onClick={() => handleShowForm()}>
            <div className="card-body">
              <AddIcon className="icon" />
              <p className="add-agent-text">Add New Master Agent</p>
            </div>
          </div>
          <div className="instructions">
            <h3>Instructions:</h3>
            <p>Click on "Add Master Agent" to add a new agent. Enter the name and category of the agent.</p>
            <p>You can edit or delete existing agents by clicking the respective icons.</p>
          </div>
        </div>
        <div className="agent-list">
          {masterAgents.length > 0 ? (
            masterAgents.map(agent => (
              <div key={agent.MasterAgentId} className="agent-card">
                <div className="card-body">
                  <div className="card-content">
                    <div className="agent-info">
                      <h5 className="card-title">{agent.Name}</h5>
                      <p className="card-text">{agent.Category}</p>
                    </div>
                    <div className="agent-avatar">
                      <img src={agent.Avatar} alt={`${agent.Name}'s avatar`} className="avatar" />
                    </div>
                  </div>
                  <div className="action-buttons">
                    {/* Link to view sub-agents associated with this master agent */}
                    <Link className="btn btn-outline-primary" to={`/sub-agents/${agent.MasterAgentId}`}>
                      View Agents
                    </Link>
                    {/* Edit and Delete icons with their respective handlers */}
                    <EditIcon className="icon edit-icon" onClick={() => handleShowForm(agent)} />
                    <DeleteIcon className="icon delete-icon" onClick={() => handleDeleteAgent(agent.MasterAgentId)} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No master agents found.</p>
          )}
        </div>
      </div>

      {/* Modal for adding/editing Master Agent */}
      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editAgent ? 'Edit Master Agent' : 'Add Master Agent'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* The MasterAgentForm is displayed inside the modal for adding or editing an agent */}
          <MasterAgentForm onAdd={handleCloseForm} agent={editAgent} formType={editAgent ? 'Edit' : 'Add'} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
