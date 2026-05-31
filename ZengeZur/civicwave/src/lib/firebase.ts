/**
 * Firebase integration for CivicWave.
 * On submit we:
 *   1. upload the photo to Firebase Storage (reports/<id>.jpg)
 *   2. write the AI explanation + image URL + location + time to the Realtime Database (/reports/<id>)
 * The web command-center reads the Realtime Database, takes `imageUrl`, and loads the photo from Storage.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, onValue, ref as dbRef, runTransaction, set } from 'firebase/database';
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';

import { CategoryId, ReportStatus, Severity } from '@/constants/categories';

// Credentials are injected at build time. Expo inlines every `EXPO_PUBLIC_*`
// variable into the bundle, so the real keys live in a git-ignored `.env`
// file (see `.env.example`) and are never hardcoded in source.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Reuse the app across Fast Refresh reloads (analytics is web-only, so it is skipped on native).
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

export type ReportUpload = {
  uri: string;
  mime: string;
  explanation: string;
  category: string;
  categoryId: CategoryId;
  severity: Severity;
  department: string;
  confidence: number;
  note?: string;
  address: string;
  lat: number;
  lng: number;
  reporter?: string;
};

export type UploadResult = { id: string; imageUrl: string };

/**
 * React Native's Blob cannot be built from an ArrayBuffer (which is what
 * firebase's uploadString(base64) does internally), so we read the local file
 * into a real Blob via XHR and use uploadBytes instead.
 */
function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response as Blob);
    xhr.onerror = () => reject(new Error('Şəkil oxunmadı'));
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
}

/** Atomically returns the next sequential id (1, 2, 3, …) for the given counter. */
async function nextSequentialId(counter: 'reportId' | 'feedbackId'): Promise<number> {
  const counterRef = dbRef(database, `counters/${counter}`);
  const result = await runTransaction(counterRef, (current) => (current || 0) + 1);
  return (result.snapshot.val() as number) || 1;
}

/** Uploads the image to Storage and writes the report record to the Realtime Database. */
export async function uploadReportToFirebase(data: ReportUpload): Promise<UploadResult> {
  const id = String(await nextSequentialId('reportId'));
  const ext = data.mime.includes('png') ? 'png' : 'jpg';

  // 1) image -> Storage (as a real Blob built from the local file URI)
  const blob = await uriToBlob(data.uri);
  const imgRef = storageRef(storage, `reports/${id}.${ext}`);
  await uploadBytes(imgRef, blob, { contentType: data.mime });
  (blob as unknown as { close?: () => void }).close?.();
  const imageUrl = await getDownloadURL(imgRef);

  // 2) record -> Realtime Database
  const createdAt = Date.now();
  await set(dbRef(database, `reports/${id}`), {
    id,
    imageUrl,
    storagePath: `reports/${id}.${ext}`,
    explanation: data.explanation,
    category: data.category,
    categoryId: data.categoryId,
    severity: data.severity,
    department: data.department,
    confidence: data.confidence,
    note: data.note ?? '',
    address: data.address,
    location: { lat: data.lat, lng: data.lng },
    reporter: data.reporter ?? 'Anonim',
    // `status` (number 0/1) + `statusText` (precise lifecycle) are the two fields
    // the web dashboard reads/writes. We seed them as "not yet approved / pending"
    // so the first state is explicit and the dashboard's logic stays aligned.
    status: 0,
    statusText: 'pending',
    createdAt,
    createdAtISO: new Date(createdAt).toISOString(),
  });

  return { id, imageUrl };
}

/**
 * The dashboard writes the officer's decision back onto the same /reports/<id>
 * record. It is the source of truth for approval state; the mobile app only reads it.
 *
 * Two fields carry the decision (see README-MOBILE-AGENT §2/§3):
 *   - `status`     number  1 = approved, 0 = pending OR rejected (ambiguous alone)
 *   - `statusText` string  precise lifecycle: pending | approved | rejected | in_progress | proof | resolved
 *
 * We prefer `statusText` (it disambiguates pending vs rejected) and fall back to the
 * numeric/string `status`. Legacy records may also store the lifecycle directly in
 * `status` as a string, so we handle that too.
 */
type RemoteReport = { status?: number | string; statusText?: string };

export function mapRemoteStatus(raw: RemoteReport): ReportStatus {
  const text = typeof raw.statusText === 'string' ? raw.statusText.toLowerCase() : '';
  switch (text) {
    case 'rejected':
      return 'rejected';
    case 'approved':
      return 'approved';
    case 'in_progress':
    case 'proof': // dashboard "being verified" → keep the citizen on the in-progress step
      return 'in_progress';
    case 'resolved':
      return 'resolved';
    case 'pending':
      return 'pending';
  }

  // No (recognised) statusText — fall back to the `status` field.
  const s = raw.status;
  if (s === 1 || s === '1') return 'approved';
  if (s === 0 || s === '0') return 'pending'; // ambiguous, but not yet rejected
  if (typeof s === 'string') {
    const sl = s.toLowerCase();
    if (sl === 'pending' || sl === 'approved' || sl === 'rejected' || sl === 'in_progress' || sl === 'resolved') {
      return sl as ReportStatus;
    }
  }
  return 'pending';
}

export type RemoteStatusMap = Record<string, ReportStatus>;

/**
 * Subscribes to every report's approval state in realtime. Calls `onChange` with a
 * map of `{ [reportId]: ReportStatus }` whenever anything under /reports changes,
 * so the mobile UI updates within seconds of the officer tapping Approve/Reject.
 * Returns an unsubscribe function.
 */
export function subscribeReportStatuses(onChange: (map: RemoteStatusMap) => void): () => void {
  const reportsRef = dbRef(database, 'reports');
  return onValue(reportsRef, (snapshot) => {
    const value = snapshot.val() as Record<string, RemoteReport> | null;
    const map: RemoteStatusMap = {};
    if (value) {
      for (const [key, record] of Object.entries(value)) {
        // `counters` lives at /counters, but guard defensively against any non-report node.
        if (key === 'counters' || !record || typeof record !== 'object') continue;
        map[key] = mapRemoteStatus(record);
      }
    }
    onChange(map);
  });
}

export type FeedbackUpload = {
  rating: number; // 1..5
  comment?: string;
  reportId?: string;
  category?: string;
  reporter?: string;
};

/**
 * Writes a citizen's post-submission feedback to the Realtime Database (/feedbacks/<pushId>).
 * The web command-center reads this list to gauge satisfaction.
 */
export async function submitFeedback(data: FeedbackUpload): Promise<string> {
  const id = String(await nextSequentialId('feedbackId'));
  const createdAt = Date.now();
  await set(dbRef(database, `feedbacks/${id}`), {
    id,
    rating: data.rating,
    comment: data.comment ?? '',
    reportId: data.reportId ?? '',
    category: data.category ?? '',
    reporter: data.reporter ?? 'Anonim',
    createdAt,
    createdAtISO: new Date(createdAt).toISOString(),
  });
  return id;
}
