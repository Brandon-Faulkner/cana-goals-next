const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('../lib/admin');
const assertAdmin = require('../utils/assertAdmin');

exports.adminCreateUser = onCall(async (request) => {
  await assertAdmin(request.auth);

  const {
    email,
    password,
    name,
    slackId = null,
    assignedGroups = [],
    admin: isAdmin = false,
  } = request.data || {};

  if (!email || !password || !name) {
    throw new HttpsError('invalid-argument', 'email, password, and name are required.');
  }

  // Create Auth user
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: name,
    disabled: false,
  });

  // Create Firestore user doc
  await admin.firestore().doc(`users/${userRecord.uid}`).set({
    name,
    email,
    slackId,
    admin: !!isAdmin,
    assignedGroups,
    disabled: false,
    settings: {
        confetti: true,
        emails: true,
    },
  });

  return { uid: userRecord.uid };
});

exports.adminDeleteUser = onCall(async (request) => {
  await assertAdmin(request.auth);

  const { uid } = request.data || {};
  if (!uid) throw new HttpsError('invalid-argument', 'uid is required.');

  // Delete Firestore user doc (and TODO: any subcollections)
  await admin.firestore().doc(`users/${uid}`).delete().catch(() => {});

  // Delete Auth user
  try {
    await admin.auth().deleteUser(uid);
  } catch (e) {
    if (e.code !== 'auth/user-not-found') throw e;
  }

  return { success: true };
});
