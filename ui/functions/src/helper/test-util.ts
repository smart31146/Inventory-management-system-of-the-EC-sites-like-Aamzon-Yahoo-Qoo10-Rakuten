import * as admin from 'firebase-admin/app';
import functionsTest from 'firebase-functions-test';

process.env.TZ = 'Asia/Tokyo';

export const initTesting = () => {
  if (admin.getApps().length === 0) {
    admin.initializeApp({
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  return functionsTest(
    {
      projectId: process.env.FIREBASE_PROJECT_ID,
    },
    process.env.FIREBASE_CREDENTIALS_PATH
  );
};
