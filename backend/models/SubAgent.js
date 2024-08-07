const Joi = require('joi');

const agentSchema = Joi.object({
  AgentID: Joi.string().uuid().required(),
  Category: Joi.string().required(),
  Role: Joi.string().required(),
  Topics: Joi.string().optional(),
  Avatar: Joi.string().optional(),
});

module.exports = agentSchema;
