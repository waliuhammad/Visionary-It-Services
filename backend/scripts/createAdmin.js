/**
 * Create a new admin user, or promote an existing Firebase Auth user to admin.
 *
 *   npm run create-admin -- <email> [password] ["Full Name"]
 */
import { auth, usersRef } from '../src/config/firebase.js';

const [email, password, name] = process.argv.slice(2);

if (!email) {
  console.error('Usage: npm run create-admin -- <email> [password] ["Full Name"]');
  process.exit(1);
}

const run = async () => {
  let userRecord;
  let created = false;

  try {
    userRecord = await auth.getUserByEmail(email);
    console.log(`Found existing user ${email} (UID: ${userRecord.uid})`);
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error;
    if (!password) {
      throw new Error('A password (min 6 characters) is required to create a new user.');
    }
    console.log(`Creating new user ${email}...`);
    userRecord = await auth.createUser({ email, password, displayName: name || 'Admin' });
    created = true;
  }

  const { uid } = userRecord;
  const now = new Date().toISOString();

  console.log('Setting admin custom claim...');
  await auth.setCustomUserClaims(uid, { ...userRecord.customClaims, role: 'admin' });

  console.log('Mirroring profile to Firestore...');
  const existing = await usersRef.doc(uid).get();
  await usersRef.doc(uid).set({
    uid,
    email,
    fullName: name || userRecord.displayName || 'Admin',
    role: 'admin',
    emailVerified: userRecord.emailVerified,
    ...(!existing.exists && { createdAt: now }),
    updatedAt: now,
  }, { merge: true });

  if (!created) {
    // Existing sessions still carry the old role; force a fresh sign-in
    await auth.revokeRefreshTokens(uid);
  }

  console.log(`✅ ${email} is now an admin. Sign in at /login.`);
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Failed to create/promote admin:', error.message);
    process.exit(1);
  });
