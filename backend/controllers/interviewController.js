const axios = require('axios');

const interactWithLambda = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { session_id, session_type, job_id, message } = req.body;

  console.log('Received request with payload:', req.body);

  const payload = {
    session_id,
    session_type,
    job_id,
    message,
    agent_role: "",
    agent_topic: "",
    jd: "",
    notes: ""
  };

  console.log('Sending payload to Lambda:', payload);

  try {
    const response = await axios.post(process.env.LAMBDA_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('Response from Lambda:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error interacting with Lambda:', error);
    if (error.response) {
      console.error('Lambda response status:', error.response.status);
      console.error('Lambda response data:', error.response.data);
    }
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

module.exports = { interactWithLambda };
