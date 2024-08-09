import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import SubAgentForm from './SubAgentForm';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/AddOutlined';
import { Modal } from 'react-bootstrap';
import '../styles/SubAgentList.css';

const SubAgentList = () => {
  // Get the masterAgentId from the URL parameters
  const { masterAgentId } = useParams();
  // useState hook is used to manage the state of sub-agents, master agent details, form visibility, and the agent being edited
  const [agents, setAgents] = useState([]);
  const [masterAgent, setMasterAgent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editAgent, setEditAgent] = useState(null);

  // Function to load sub-agents associated with the master agent's category
  const loadAgents = useCallback(async () => {
    try {
      if (masterAgent) {
        // Fetch the agents based on the master agent's category
        const result = await axios.get(`http://localhost:5001/api/agents?category=${masterAgent.Category}`);
        setAgents(result.data); // Set the fetched agents into state
        console.log('Loaded agents:', result.data);
      }
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  }, [masterAgent]);

  // Function to load master agent details
  const loadMasterAgent = useCallback(async () => {
    try {
      // Fetch the master agent based on masterAgentId
      const result = await axios.get(`http://localhost:5001/api/master-agents/${masterAgentId}`);
      setMasterAgent(result.data); // Set the fetched master agent details into state
      console.log('Loaded master agent:', result.data);
    } catch (error) {
      console.error('Error loading master agent:', error);
    }
  }, [masterAgentId]);

  // Function to close the form modal and reload agents
  const handleCloseForm = () => {
    setShowForm(false); // Hide the form
    loadAgents(); // Reload the list of sub-agents
  };

  // Function to delete a sub-agent by its ID
  const handleDeleteAgent = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/agents/${id}`);
      loadAgents(); // Reload the list after deletion
      console.log('Deleted agent with ID:', id);
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  // Function to edit a sub-agent
  const handleEditAgent = (agent) => {
    setEditAgent(agent); // Set the agent being edited
    setShowForm(true); // Show the form modal
  };

  // Function to add a new sub-agent
  const handleAddAgent = () => {
    setEditAgent(null); // No agent is being edited, so set editAgent to null
    setShowForm(true); // Show the form modal
  };

  // useEffect hook to load the master agent details when the component first renders or when masterAgentId changes
  useEffect(() => {
    loadMasterAgent();
  }, [loadMasterAgent]);

  // useEffect hook to load the agents when the master agent details are loaded or when the list of agents changes
  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  return (
    <div className="container mt-3">
      {/* Display master agent details if available */}
      {masterAgent && (
        <>
          <h2>Agents in {masterAgent.Category}</h2>
          <p><strong>Master Agent:</strong> {masterAgent.Name}</p> {/* Display Master Agent name */}
          <p><strong>Category:</strong> {masterAgent.Category}</p> {/* Display Master Agent category */}
        </>
      )}
      <div className="instructions-and-add">
        {/* Button to show the form for adding a new sub-agent */}
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
        {/* Display the list of agents associated with the master agent */}
        {agents.map(agent => (
          <div key={agent.AgentID} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{agent.Role}</h5>
                <p className="card-text">{agent.Topics}</p>
                <p className="card-text"><strong>Agent ID:</strong> {agent.AgentID}</p> {/* Display AgentID */}
                <div className="action-buttons">
                  {/* Link to view a demo for the selected agent */}
                  <Link className="btn btn-outline-primary" to={`/agent-demo/${agent.AgentID}`}>
                    View Demo
                  </Link>
                  {/* Edit and Delete icons with their respective handlers */}
                  <EditIcon className="icon edit-icon" onClick={() => handleEditAgent(agent)} />
                  <DeleteIcon className="icon delete-icon" onClick={() => handleDeleteAgent(agent.AgentID)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding/editing a Sub-Agent */}
      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editAgent ? 'Edit Agent' : 'Add Agent'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* The SubAgentForm is displayed inside the modal for adding or editing a sub-agent */}
          <SubAgentForm masterAgent={masterAgent} onAdd={handleCloseForm} editAgent={editAgent} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SubAgentList;
