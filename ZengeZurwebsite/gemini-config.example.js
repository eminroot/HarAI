/* ============================================================
   CivicWave — Gemini configuration
   Used by the command center to AI-validate the manager's "fixed"
   photo before a case can be closed.

   Setup: copy this file to `gemini-config.js` and drop in your own
   Gemini API key (https://aistudio.google.com/apikey). `gemini-config.js`
   is git-ignored. For production, proxy Gemini through a backend so the
   key is never exposed client-side.
   ============================================================ */
window.GEMINI_CONFIG = {
  apiKey: "YOUR_GEMINI_API_KEY",
  model:  "gemini-2.5-flash"
};
