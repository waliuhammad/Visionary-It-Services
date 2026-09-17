import { auth, usersRef } from '../src/config/firebase.js';

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: node scripts/createAdmin.js <email> [password] [name]');
  process.exit(1);
}

const [email, password, name] = args;

const run = async () => {
  try {
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log(`Found existing user with email ${email} (UID: ${userRecord.uid})`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        if (!password) {
          console.error('Error: Password is required to create a new user.');
          process.exit(1);
        }
        console.log(`Creating new user with email ${email}...`);
        userRecord = await auth.createUser({
          email,
          password,
          displayName: name || 'Admin',
        });
      } else {
        throw error;
      }
    }

    const uid = userRecord.uid;

    console.log('Setting custom claims...');
    await auth.setCustomUserClaims(uid, { role: 'admin' });

    console.log('Mirroring role to Firestore...');
    await usersRef.doc(uid).set({
      uid,
      email,
      fullName: userRecord.displayName,
      role: 'admin',
      updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log('Revoking refresh tokens...');
    await auth.revokeRefreshTokens(uid);

    console.log(`✅ User ${email} is now an admin.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create/promote admin:', error);
    process.exit(1);
  }
};

run();
