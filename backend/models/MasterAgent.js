const Joi = require('joi');

const masterAgentSchema = Joi.object({
  MasterAgentId: Joi.string().uuid().required(),
  Name: Joi.string().required(),
  Category: Joi.string().optional(),
  Avatar: Joi.string().optional(), // Add Avatar if you are using it
});

module.exports = masterAgentSchema;
