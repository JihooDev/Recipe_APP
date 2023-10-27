import { GOOGLE_CLIENT_ID, FIREBASE_API_KEY, APP_ID, DATABASE_URL, SENDER_ID, STORAGE_BUCKET } from '@env';

export const initConfig = {
    clientId: GOOGLE_CLIENT_ID,
    appId: APP_ID,
    apiKey: FIREBASE_API_KEY,
    databaseURL: DATABASE_URL,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: SENDER_ID,
    projectId: DATABASE_URL,
}