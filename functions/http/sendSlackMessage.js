const { onCall } = require('firebase-functions/v2/https');
const axios = require('axios').default;
const { SLACK_MESSAGE_WEBHOOK_KEY } = require('../lib/config');

// Called from the Cana Goals web app to send user goal changes to Slack
exports.sendSlackMessage = onCall(async (request) => {
  const message = request.data?.message;

  if (!message) {
    throw new Error('Invalid argument: The function must be called with a message');
  }

  try {
    const response = await axios.post(SLACK_MESSAGE_WEBHOOK_KEY, { text: message });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending message to Slack:', error);
    throw new Error('Internal error: Unable to send message to Slack.');
  }
});
