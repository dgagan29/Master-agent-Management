// backend/controllers/demoController.js
const AWS = require('aws-sdk');
const shortid = require('shortid');

// Configuring AWS SDK with environment variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  sessionToken: process.env.AWS_SESSION_TOKEN // Add session token if needed
});

// Creating a DynamoDB DocumentClient instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Endpoint to add a new Job
const addJob = async (req, res) => {
  // Destructure the request body to get the necessary fields
  const { agentId, hrNotes, jobDescription, jobId } = req.body;
  
  // Construct the new job object
  const newJob = {
    JobID: jobId, // Use the job ID provided in the request (ensure it's a string)
    AgentID: agentId,
    HRNotes: hrNotes,
    JobDescription: jobDescription,
  };

  // Define the parameters for the DynamoDB put operation
  const params = {
    TableName: 'Jobs',
    Item: newJob,
  };
  
  try {
    // Attempt to add the new job to the DynamoDB table
    await dynamoDB.put(params).promise();
    console.log('Added job:', newJob);
    
    // Respond with a success message
    res.json({ message: 'Job added' });
  } catch (error) {
    // Log and respond with an error message if something goes wrong
    console.error('Error adding job:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addJob };
