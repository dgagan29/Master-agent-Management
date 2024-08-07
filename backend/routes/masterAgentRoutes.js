const express = require('express');
const {
  getMasterAgents,
  getMasterAgentById,
  addMasterAgent,
  updateMasterAgent,
  deleteMasterAgent
} = require('../controllers/masterAgentController');

const router = express.Router();

router.get('/', getMasterAgents);
router.get('/:id', getMasterAgentById);
router.post('/', addMasterAgent);
router.put('/:id', updateMasterAgent);
router.delete('/:id', deleteMasterAgent);

module.exports = router;
