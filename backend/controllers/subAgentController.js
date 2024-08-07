const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configuring AWS SDK with environment variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  sessionToken: process.env.AWS_SESSION_TOKEN // Add session token if needed
});

// Creating a DynamoDB DocumentClient instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Endpoint to retrieve all Agents associated with a category
const getAgents = async (req, res) => {
  const { category } = req.query;
  const params = {
    TableName: 'Agents',
    FilterExpression: 'Category = :category',
    ExpressionAttributeValues: { ':category': category },
  };
  try {
    const data = await dynamoDB.scan(params).promise();
    console.log('Retrieved agents:', data.Items);
    res.json(data.Items);
  } catch (error) {
    console.error('Error getting agents:', error);
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to add a new Agent
const addAgent = async (req, res) => {
  const { category, role, topics, avatar } = req.body;
  const newAgent = {
    AgentID: uuidv4(),
    Category: category,
    Role: role,
    Topics: topics,
    Avatar: avatar,
  };

  const params = {
    TableName: 'Agents',
    Item: newAgent,
  };
  try {
    await dynamoDB.put(params).promise();
    console.log('Added agent:', newAgent);
    res.json({ message: 'Agent added' });
  } catch (error) {
    console.error('Error adding agent:', error);
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to update an existing Agent by ID
const updateAgent = async (req, res) => {
  const { id } = req.params;
  const { role, topics, avatar } = req.body;

  const params = {
    TableName: 'Agents',
    Key: { AgentID: id },
    UpdateExpression: 'set Role = :role, Topics = :topics, Avatar = :avatar',
    ExpressionAttributeValues: { ':role': role, ':topics': topics, ':avatar': avatar },
  };
  try {
    await dynamoDB.update(params).promise();
    console.log('Updated agent with ID:', id);
    res.json({ message: 'Agent updated' });
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to delete an Agent by ID
const deleteAgent = async (req, res) => {
  const { id } = req.params;

  const params = { TableName: 'Agents', Key: { AgentID: id } };
  try {
    await dynamoDB.delete(params).promise();
    console.log('Deleted agent with ID:', id);
    res.json({ message: 'Agent deleted' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAgents, addAgent, updateAgent, deleteAgent };
