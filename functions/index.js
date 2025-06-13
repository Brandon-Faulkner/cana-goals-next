const { onCall } = require('firebase-functions/v2/https');
const axios = require('axios').default;
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const emailjs = require('@emailjs/nodejs');
const admin = require('firebase-admin');
admin.initializeApp();
require('dotenv').config();

const {
  SLACK_MESSAGE_WEBHOOK_KEY: SLACK_MESSAGE_WEBHOOK,
  SLACK_STATUS_WEBHOOK_KEY: SLACK_STATUS_WEBHOOK,
  EMAILJS_PUBLIC_KEY: EMAILJS_PUBLIC_KEY,
  EMAILJS_PRIVATE_KEY: EMAILJS_PRIVATE_KEY,
  EMAILJS_SERVICE_ID: EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID: EMAILJS_TEMPLATE_ID,
} = process.env;

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY, privateKey: EMAILJS_PRIVATE_KEY });

// Called from the Cana Goals web app to send user goal changes to Slack
exports.sendSlackMessage = onCall(async (request) => {
  const message = request.data.message;

  if (!message) {
    throw new Error('Invalid argument: The function must be called with a message');
  }

  try {
    const response = await axios.post(SLACK_MESSAGE_WEBHOOK, { text: message });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending message to Slack:', error);
    throw new Error('Internal error: Unable to send message to Slack.');
  }
});

// Called from the Cana Goals web app to send user status changes to Slack
exports.sendSlackUserStatus = onCall(async (request) => {
  const message = request.data.message;

  if (!message) {
    throw new Error('Invalid argument: The function must be called with a message');
  }

  try {
    const response = await axios.post(SLACK_STATUS_WEBHOOK, { text: message });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending status to Slack:', error);
    throw new Error('Internal error: Unable to send status to Slack.');
  }
});

// Automatically runs when a comment is created to email the goal owner and notify slack
exports.notifyOnComment = onDocumentCreated(
  'semesters/{semesterId}/goals/{goalId}/comments/{commentId}',
  async (event) => {
    const { semesterId, goalId } = event.params;
    const comment = event.data.data();
    const { userId: commenterId, userName: commenterName, text } = comment;

    // Fetch the goal document to determine its owner
    const goalSnap = await admin.firestore().doc(`semesters/${semesterId}/goals/${goalId}`).get();
    if (!goalSnap.exists) return;
    const goalData = goalSnap.data();
    const ownerId = goalData.userId;
    // Skip notification if the owner wrote the comment
    if (ownerId === commenterId) return;

    // Fetch the goal-owner’s profile
    const ownerSnap = await admin.firestore().doc(`users/${ownerId}`).get();
    if (!ownerSnap.exists) return;

    const owner = ownerSnap.data();
    const sendEmailNotif = owner.settings?.emails && owner.email;

    // Fetch commenter's profile for Slack ID
    let commenterSlackId = commenterName;
    try {
      const commenterDocSnap = await admin.firestore().doc(`users/${commenterId}`).get();
      if (commenterDocSnap.exists && commenterDocSnap.data()?.slackId) {
        commenterSlackId = `<@${commenterDocSnap.data().slackId}>`;
      }
    } catch (e) {
      console.error("Error fetching commenter's Slack ID:", e);
    }

    const ownerSlackId = owner.slackId ? `<@${owner.slackId}>` : owner.name;

    // Determine goal text for email template
    const goalText = goalData.text || 'your goal';

    // Fetch the semester document to get its display name
    const semSnap = await admin.firestore().doc(`semesters/${semesterId}`).get();
    const semesterName =
      semSnap.exists && semSnap.data().semester ? semSnap.data().semester : semesterId;

    // Prepare EmailJS params
    if (sendEmailNotif) {
      const templateParams = {
        to_email: owner.email,
        to_name: owner.name,
        comment_name: commenterName,
        message: text,
        goal_content: goalText,
        semester: semesterName,
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        console.log('📬 Comment notification sent to', owner.email);
      } catch (err) {
        console.error('EmailJS error:', err);
      }
    }

    // Prepare and send Slack notification
    if (owner.slackId) {
      const slackMessage = `${commenterSlackId} left a comment on goal "${goalText.substring(0, 50)}${goalText.length > 50 ? '...' : ''}" for ${ownerSlackId} in the ${semesterName} semester.`;
      try {
        await axios.post(SLACK_MESSAGE_WEBHOOK, { text: slackMessage });
        console.log('💬 Slack notification for comment sent.');
      } catch (error) {
        console.error('Error sending Slack message for comment:', error);
      }
    }
  },
);
