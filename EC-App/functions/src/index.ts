import * as admin from 'firebase-admin/app';
import * as api from './api';

process.env.TZ = 'Asia/Tokyo';

if (admin.getApps().length === 0) {
  admin.initializeApp();
}

export { api };
