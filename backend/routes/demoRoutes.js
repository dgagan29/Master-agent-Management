// backend/routes/demoRoutes.js
const express = require('express');
const { addJob } = require('../controllers/demoController');
const cors = require('cors'); // Import the CORS library

const router = express.Router();

router.use(cors()); // This will enable CORS for this specific router

router.post('/', addJob);

module.exports = router;
