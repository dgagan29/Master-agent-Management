const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configuring AWS SDK with environment variables for secure access to AWS services
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Access key for AWS account
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Secret access key for AWS account
  sessionToken: process.env.AWS_SESSION_TOKEN, // Optional: Session token for temporary credentials
  region: process.env.AWS_REGION, // AWS region where the services are hosted
});

// Creating a DynamoDB DocumentClient instance to interact with DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Function to get all Master Agents from the DynamoDB table
const getAllMasterAgents = async () => {
  let items = [];
  let params = {
    TableName: 'MasterAgents' // Name of the DynamoDB table
  };
  
  let data;
  // Loop to scan all items from the DynamoDB table, handling pagination if necessary
  do {
    data = await dynamoDB.scan(params).promise(); // Perform the scan operation
    items = items.concat(data.Items); // Concatenate the fetched items
    params.ExclusiveStartKey = data.LastEvaluatedKey; // Update the start key for the next scan if more items exist
  } while (typeof data.LastEvaluatedKey !== "undefined");

  return items; // Return all the items retrieved from the table
};

// Endpoint to retrieve all Master Agents
const getMasterAgents = async (req, res) => {
  try {
    const items = await getAllMasterAgents(); // Fetch all master agents using the getAllMasterAgents function
    res.json({
      Items: items,
      TotalCount: items.length // Return total count of master agents
    });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return an error response if something goes wrong
  }
};

// Endpoint to retrieve a specific Master Agent by ID
const getMasterAgentById = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters
  const params = {
    TableName: 'MasterAgents', // Name of the DynamoDB table
    Key: { MasterAgentId: id }, // Specify the primary key (MasterAgentId) for the item to retrieve
  };
  try {
    const data = await dynamoDB.get(params).promise(); // Fetch the specific master agent from the table
    res.json(data.Item); // Return the retrieved item as a response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return an error response if something goes wrong
  }
};

// Endpoint to add a new Master Agent
const addMasterAgent = async (req, res) => {
  const { name, category, avatar } = req.body; // Extract the name, category, and avatar from the request body
  const newAgent = {
    MasterAgentId: uuidv4(), // Generate a unique ID for the new master agent using uuidv4
    Name: name,
    Category: category,
    Avatar: avatar,
  };

  const params = {
    TableName: 'MasterAgents', // Name of the DynamoDB table
    Item: newAgent, // The new master agent data to be added
  };
  try {
    await dynamoDB.put(params).promise(); // Add the new master agent to the DynamoDB table
    res.json({ message: 'Master Agent added' }); // Return a success message
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return an error response if something goes wrong
  }
};

// Endpoint to update an existing Master Agent by ID
const updateMasterAgent = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters
  const { name, category, avatar } = req.body; // Extract the updated name, category, and avatar from the request body

  const params = {
    TableName: 'MasterAgents', // Name of the DynamoDB table
    Key: { MasterAgentId: id }, // Specify the primary key (MasterAgentId) for the item to update
    UpdateExpression: 'set #name = :name, Category = :category, Avatar = :avatar', // Define the update expression
    ExpressionAttributeNames: { '#name': 'Name' }, // Map the attribute name 'Name' to avoid conflicts with reserved words
    ExpressionAttributeValues: { ':name': name, ':category': category, ':avatar': avatar }, // Provide the updated values
  };
  try {
    await dynamoDB.update(params).promise(); // Update the existing master agent in the DynamoDB table
    res.json({ message: 'Master Agent updated' }); // Return a success message
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return an error response if something goes wrong
  }
};

// Endpoint to delete a Master Agent by ID
const deleteMasterAgent = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  const params = { 
    TableName: 'MasterAgents', // Name of the DynamoDB table
    Key: { MasterAgentId: id } // Specify the primary key (MasterAgentId) for the item to delete
  };
  try {
    await dynamoDB.delete(params).promise(); // Delete the master agent from the DynamoDB table
    res.json({ message: 'Master Agent deleted' }); // Return a success message
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return an error response if something goes wrong
  }
};

// Export the functions so they can be used in other parts of the application
module.exports = { getMasterAgents, getMasterAgentById, addMasterAgent, updateMasterAgent, deleteMasterAgent };
