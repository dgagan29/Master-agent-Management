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
  const { agentId, hrNotes, jobDescription } = req.body;
  const newJob = {
    JobID: shortid.generate(),
    AgentID: agentId,
    HRNotes: hrNotes,
    JobDescription: jobDescription,
  };

  const params = {
    TableName: 'Jobs',
    Item: newJob,
  };
  try {
    await dynamoDB.put(params).promise();
    console.log('Added job:', newJob);
    res.json({ message: 'Job added' });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addJob };
