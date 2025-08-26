const admin = require('../lib/admin');
const { HttpsError } = require('firebase-functions/v2/https');

module.exports = async function assertAdmin(auth) {
  const uid = auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'You must be signed in.');
  const snap = await admin.firestore().doc(`users/${uid}`).get();
  if (!snap.exists || snap.data()?.admin !== true) {
    throw new HttpsError('permission-denied', 'Admins only.');
  }
};
