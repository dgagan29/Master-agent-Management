const express = require('express');
const { getAgents, addAgent, updateAgent, deleteAgent } = require('../controllers/subAgentController'); // Make sure this matches your controller file name

const router = express.Router();

router.get('/', getAgents); // Changed to get agents by category query parameter
router.post('/', addAgent);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

module.exports = router;
