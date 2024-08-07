const express = require('express');
const { getAgents, getAgentById, addAgent, updateAgent, deleteAgent } = require('../controllers/subAgentController');

const router = express.Router();

router.get('/', getAgents); // Retrieve all agents by category
router.get('/:id', getAgentById); // Retrieve a single agent by ID
router.post('/', addAgent);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

module.exports = router;
