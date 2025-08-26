require('dotenv').config();
const emailjs = require('@emailjs/nodejs');

const {
  SLACK_MESSAGE_WEBHOOK_KEY,
  SLACK_STATUS_WEBHOOK_KEY,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_PRIVATE_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} = process.env;

if (EMAILJS_PUBLIC_KEY && EMAILJS_PRIVATE_KEY) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY, privateKey: EMAILJS_PRIVATE_KEY });
}

module.exports = {
  emailjs,
  SLACK_MESSAGE_WEBHOOK_KEY,
  SLACK_STATUS_WEBHOOK_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
};
