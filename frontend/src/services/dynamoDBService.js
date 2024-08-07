import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
    region: 'your-region', // Replace with your AWS region
    accessKeyId: 'your-access-key-id', // Replace with your AWS Access Key ID
    secretAccessKey: 'your-secret-access-key' // Replace with your AWS Secret Access Key
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const addMasterAgent = async (name, details) => {
  const params = {
    TableName: 'MasterAgents',
    Item: {
      MasterAgentId: uuidv4(),
      Name: name,
      Details: details,
    },
  };
  return dynamoDB.put(params).promise();
};

export const getMasterAgents = async () => {
  const params = {
    TableName: 'MasterAgents',
  };
  return dynamoDB.scan(params).promise();
};

export const addSubAgent = async (masterAgentId, name, details) => {
  const params = {
    TableName: 'SubAgents',
    Item: {
      SubAgentId: uuidv4(),
      MasterAgentId: masterAgentId,
      Name: name,
      Details: details,
    },
  };
  return dynamoDB.put(params).promise();
};

export const getSubAgents = async (masterAgentId) => {
  const params = {
    TableName: 'SubAgents',
    IndexName: 'MasterAgentIndex',
    KeyConditionExpression: 'MasterAgentId = :masterAgentId',
    ExpressionAttributeValues: {
      ':masterAgentId': masterAgentId,
    },
  };
  return dynamoDB.query(params).promise();
};
