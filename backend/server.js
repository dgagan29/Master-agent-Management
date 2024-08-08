// backend/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes for master agents, sub agents, demo, and interview
const masterAgentRoutes = require('./routes/masterAgentRoutes');
const subAgentRoutes = require('./routes/subAgentRoutes');
const demoRoutes = require('./routes/demoRoutes'); // New demo routes
const interviewRoutes = require('./routes/interviewRoutes'); // New interview routes

const app = express();

// Middleware to parse JSON bodies with increased limit
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Middleware to enable Cross-Origin Resource Sharing
app.use(cors({
  origin: 'http://localhost:3000' // Allow only this origin
}));

// Route for handling master agent related requests
app.use('/api/master-agents', masterAgentRoutes);

// Route for handling agent related requests (previously sub agents)
app.use('/api/agents', subAgentRoutes);

// Route for handling demo related requests
app.use('/api/jobs', demoRoutes);

// Route for handling interview related requests
app.use('/api/interview', interviewRoutes); // New interview routes

// Set the port to the value in environment variable or default to 5001
const PORT = process.env.PORT || 5001;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
