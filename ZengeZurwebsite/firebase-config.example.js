/* ============================================================
   CivicWave — Firebase configuration  (Realtime Database + Storage)
   Same project the citizen mobile app writes to.

   Setup: copy this file to `firebase-config.js` and fill in your own
   Firebase project credentials. `firebase-config.js` is git-ignored, so
   real keys never land in the repo. (The dashboard talks to Firebase over
   the REST API — no SDK — so these values are just plain globals.)
   ============================================================ */
window.FIREBASE_CONFIG = {
  apiKey:            "YOUR_FIREBASE_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT",
  storageBucket:     "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
  measurementId:     "YOUR_MEASUREMENT_ID"
};

// Live mode on. Set to false to force the offline demo dataset.
window.FIREBASE_ENABLED = true;

// Realtime Database node holding the citizen reports.
window.FIREBASE_NODE = "reports";
