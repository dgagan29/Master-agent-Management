const axios = require('axios');

// Function to interact with the AWS Lambda function
const interactWithLambda = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const { session_id, session_type, job_id, message } = req.body;

  // Log the incoming request with session ID, session type, and the user's message
  console.log(`Session ID: ${session_id}, Session Type: ${session_type}, Job ID: ${job_id}`);
  console.log(`Message from user: ${message}`);

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
    // Make a POST request to the AWS Lambda function with the payload
    const response = await axios.post(process.env.LAMBDA_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Log the response received from Lambda with the session ID
    console.log(`Response from Lambda (Session ID: ${session_id}):`, response.data);

    // Send the Lambda response back to the client
    res.json(response.data);
  } catch (error) {
    // Log any errors that occur during the request
    console.error('Error interacting with Lambda:', error);
    if (error.response) {
      console.error('Lambda response status:', error.response.status);
      console.error('Lambda response data:', error.response.data);
    }
    // Send a 500 Internal Server Error response if something goes wrong
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Export the interactWithLambda function so it can be used in other parts of the application
module.exports = { interactWithLambda };
