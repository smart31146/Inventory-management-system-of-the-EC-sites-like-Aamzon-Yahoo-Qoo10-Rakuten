import { initializeApp, getApps } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
} from 'firebase/firestore';
import { firebaseConfig } from './firebase.config';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

let isInitialized = !!getApps().length;

let app = initializeApp(firebaseConfig);
let auth = getAuth(app);
let store: Firestore;

if (!isInitialized) {
  store = initializeFirestore(app, {
    ignoreUndefinedProperties: true,
  });
} else {
  store = getFirestore(app);
}
const functions = getFunctions(app, 'asia-northeast1');
console.log({getApp: getApps() , isInitialized,NODE_ENV: process.env.NODE_ENV })
if ( process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(store, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001)
  console.log('connect to emulator');
}

export { app, auth, store, functions };
