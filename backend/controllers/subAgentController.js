const AWS = require('aws-sdk');
const shortid = require('shortid');

// Configuring AWS SDK with environment variables for secure access to AWS services
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Access key for AWS account
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Secret access key for AWS account
  region: process.env.AWS_REGION, // AWS region where the services are hosted
  sessionToken: process.env.AWS_SESSION_TOKEN // Optional: Session token for temporary credentials
});

// Creating a DynamoDB DocumentClient instance to interact with DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Endpoint to retrieve all Agents associated with a category
const getAgents = async (req, res) => {
  const { category } = req.query; // Extract the category from the request query parameters
  const params = {
    TableName: 'Agents', // Name of the DynamoDB table
    FilterExpression: 'Category = :category', // Filter to get only agents in the specified category
    ExpressionAttributeValues: { ':category': category }, // Value for the filter expression
  };
  try {
    const data = await dynamoDB.scan(params).promise(); // Perform the scan operation to retrieve agents
    console.log('Retrieved agents:', data.Items); // Log the retrieved agents to the console
    res.json(data.Items); // Return the retrieved agents in the response
  } catch (error) {
    console.error('Error getting agents:', error); // Log any errors that occur
    res.status(500).json({ error: error.message }); // Return an error response if something goes wrong
  }
};

// Endpoint to retrieve a single Agent by ID
const getAgentById = async (req, res) => {
  const { id } = req.params; // Extract the agent ID from the request parameters
  const params = {
    TableName: 'Agents', // Name of the DynamoDB table
    Key: { AgentID: id }, // Specify the primary key (AgentID) for the item to retrieve
  };
  try {
    const data = await dynamoDB.get(params).promise(); // Fetch the specific agent from the table
    if (!data.Item) {
      return res.status(404).json({ error: 'Agent not found' }); // Return a 404 error if the agent is not found
    }
    console.log('Retrieved agent:', data.Item); // Log the retrieved agent to the console
    res.json(data.Item); // Return the retrieved agent in the response
  } catch (error) {
    console.error('Error getting agent:', error); // Log any errors that occur
    res.status(500).json({ error: error.message }); // Return an error response if something goes wrong
  }
};

// Endpoint to add a new Agent
const addAgent = async (req, res) => {
  const { category, role, topics, avatar } = req.body; // Extract the agent details from the request body
  const newAgent = {
    AgentID: shortid.generate(), // Generate a unique ID for the new agent using shortid
    Category: category,
    Role: role,
    Topics: topics,
    Avatar: avatar,
  };

  const params = {
    TableName: 'Agents', // Name of the DynamoDB table
    Item: newAgent, // The new agent data to be added
  };
  try {
    await dynamoDB.put(params).promise(); // Add the new agent to the DynamoDB table
    console.log('Added agent:', newAgent); // Log the added agent to the console
    res.json({ message: 'Agent added' }); // Return a success message
  } catch (error) {
    console.error('Error adding agent:', error); // Log any errors that occur
    res.status(500).json({ error: error.message }); // Return an error response if something goes wrong
  }
};

// Endpoint to update an existing Agent by ID
const updateAgent = async (req, res) => {
  const { id } = req.params; // Extract the agent ID from the request parameters
  const { role, topics, avatar } = req.body; // Extract the updated agent details from the request body

  const params = {
    TableName: 'Agents', // Name of the DynamoDB table
    Key: { AgentID: id }, // Specify the primary key (AgentID) for the item to update
    UpdateExpression: 'set Role = :role, Topics = :topics, Avatar = :avatar', // Define the update expression
    ExpressionAttributeValues: { ':role': role, ':topics': topics, ':avatar': avatar }, // Provide the updated values
  };
  try {
    await dynamoDB.update(params).promise(); // Update the existing agent in the DynamoDB table
    console.log('Updated agent with ID:', id); // Log the updated agent to the console
    res.json({ message: 'Agent updated' }); // Return a success message
  } catch (error) {
    console.error('Error updating agent:', error); // Log any errors that occur
    res.status(500).json({ error: error.message }); // Return an error response if something goes wrong
  }
};

// Endpoint to delete an Agent by ID
const deleteAgent = async (req, res) => {
  const { id } = req.params; // Extract the agent ID from the request parameters

  const params = { 
    TableName: 'Agents', // Name of the DynamoDB table
    Key: { AgentID: id } // Specify the primary key (AgentID) for the item to delete
  };
  try {
    await dynamoDB.delete(params).promise(); // Delete the agent from the DynamoDB table
    console.log('Deleted agent with ID:', id); // Log the deleted agent ID to the console
    res.json({ message: 'Agent deleted' }); // Return a success message
  } catch (error) {
    console.error('Error deleting agent:', error); // Log any errors that occur
    res.status(500).json({ error: error.message }); // Return an error response if something goes wrong
  }
};

// Export the functions so they can be used in other parts of the application
module.exports = { getAgents, getAgentById, addAgent, updateAgent, deleteAgent };
