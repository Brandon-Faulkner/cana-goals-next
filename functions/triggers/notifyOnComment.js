const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const axios = require('axios').default;
const admin = require('../lib/admin');
const {
  emailjs,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  SLACK_MESSAGE_WEBHOOK_KEY,
} = require('../lib/config');

// Automatically runs when a comment is created to email the goal owner and notify slack
exports.notifyOnComment = onDocumentCreated(
  'semesters/{semesterId}/goals/{goalId}/comments/{commentId}',
  async (event) => {
    const { semesterId, goalId } = event.params;
    const comment = event.data.data();
    const { userId: commenterId, userName: commenterName, text } = comment;

    //Fetch goal and owner
    const goalRef = admin.firestore().doc(`semesters/${semesterId}/goals/${goalId}`);
    const goalSnap = await goalRef.get();
    if (!goalSnap.exists) return;

    const goal = goalSnap.data();
    const goalText = goal.text || 'your goal';
    const ownerId = goal.userId;
    if (ownerId === commenterId) return;

    const ownerSnap = await admin.firestore().doc(`users/${ownerId}`).get();
    if (!ownerSnap.exists) return;
    const owner = ownerSnap.data();

    //Fetch semester for display + group gate
    const semSnap = await admin.firestore().doc(`semesters/${semesterId}`).get();
    const semData = semSnap.exists ? semSnap.data() : {};
    const semesterName = semData?.semester || semesterId;
    const groupId = semData?.group;

    //Email notification
    const sendEmailNotif = owner.settings?.emails && owner.email;
    if (sendEmailNotif && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
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

    //Slack notification (Only if group has slack enabled)
    if (!groupId) return;
    const groupSnap = await admin.firestore().doc(`groups/${groupId}`).get();
    const groupData = groupSnap.exists ? groupSnap.data() : {};
    if (groupData.slackEnabled !== true) return;

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
    const goalSnippet = `${goalText.substring(0, 50)}${goalText.length > 50 ? '...' : ''}`;

    if (owner.slackId) {
      const slackMessage = `${commenterSlackId} left a comment on goal "${goalSnippet}" for ${ownerSlackId} in the ${semesterName} semester.`;
      try {
        await axios.post(SLACK_MESSAGE_WEBHOOK_KEY, { text: slackMessage });
        console.log('💬 Slack notification for comment sent.');
      } catch (error) {
        console.error('Error sending Slack message for comment:', error);
      }
    }
  },
);
