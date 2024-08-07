const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configuring AWS SDK with environment variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN, // Add this line if you use temporary credentials
  region: process.env.AWS_REGION,
});

// Creating a DynamoDB DocumentClient instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Function to get all Master Agents from the DynamoDB table
const getAllMasterAgents = async () => {
  let items = [];
  let params = {
    TableName: 'MasterAgents'
  };
  
  let data;
  do {
    data = await dynamoDB.scan(params).promise();
    items = items.concat(data.Items);
    params.ExclusiveStartKey = data.LastEvaluatedKey;
  } while (typeof data.LastEvaluatedKey !== "undefined");

  return items;
};

// Endpoint to retrieve all Master Agents
const getMasterAgents = async (req, res) => {
  try {
    const items = await getAllMasterAgents();
    res.json({
      Items: items,
      TotalCount: items.length // Return total count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to retrieve a specific Master Agent by ID
const getMasterAgentById = async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: 'MasterAgents',
    Key: { MasterAgentId: id },
  };
  try {
    const data = await dynamoDB.get(params).promise();
    res.json(data.Item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to add a new Master Agent
const addMasterAgent = async (req, res) => {
  const { name, category, avatar } = req.body;
  const newAgent = {
    MasterAgentId: uuidv4(),
    Name: name,
    Category: category,
    Avatar: avatar,
  };

  const params = {
    TableName: 'MasterAgents',
    Item: newAgent,
  };
  try {
    await dynamoDB.put(params).promise();
    res.json({ message: 'Master Agent added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to update an existing Master Agent by ID
const updateMasterAgent = async (req, res) => {
  const { id } = req.params;
  const { name, category, avatar } = req.body;

  const params = {
    TableName: 'MasterAgents',
    Key: { MasterAgentId: id },
    UpdateExpression: 'set #name = :name, Category = :category, Avatar = :avatar',
    ExpressionAttributeNames: { '#name': 'Name' },
    ExpressionAttributeValues: { ':name': name, ':category': category, ':avatar': avatar },
  };
  try {
    await dynamoDB.update(params).promise();
    res.json({ message: 'Master Agent updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to delete a Master Agent by ID
const deleteMasterAgent = async (req, res) => {
  const { id } = req.params;

  const params = { TableName: 'MasterAgents', Key: { MasterAgentId: id } };
  try {
    await dynamoDB.delete(params).promise();
    res.json({ message: 'Master Agent deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMasterAgents, getMasterAgentById, addMasterAgent, updateMasterAgent, deleteMasterAgent };
