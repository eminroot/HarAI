/* ============================================================
   CivicWave — Firebase integration (REST, no SDK / no modules)
   Robust across file://, http, cache and CDN issues:
   - reads /reports via the Realtime Database REST API (short polling)
   - writes status / department via REST PATCH
   - uploads the manager's "fixed" photo via the Storage REST endpoint
   Falls back to the demo dataset if disabled.
   ============================================================ */
(function(){
  const cfg = window.FIREBASE_CONFIG || {};
  const enabled = window.FIREBASE_ENABLED === true && cfg.databaseURL;

  if(!enabled){
    window.CIVIC_FB = { enabled:false };
    console.info("[CivicWave] Firebase deaktiv — demo məlumatı ilə işləyir.");
    return;
  }

  const BASE   = cfg.databaseURL.replace(/\/+$/,'');
  const NODE   = window.FIREBASE_NODE || "reports";
  const BUCKET = cfg.storageBucket;
  const POLL   = 4000;           // ms — near real-time, cheap for this dataset
  let lastSig  = null;

  async function load(){
    try{
      const val = await fetch(`${BASE}/${NODE}.json?ts=${Date.now()}`, {cache:'no-store'}).then(r=>r.json());
      const sig = JSON.stringify(val);
      if(sig === lastSig) return;          // nothing changed → don't re-render
      lastSig = sig;
      const rows = val ? Object.keys(val)
        .filter(k => k && k !== "counters" && val[k] && typeof val[k] === "object")
        .map(k => window.CIVIC.mapDoc(k, val[k])) : [];
      window.CIVIC.ingestLive(rows);
    }catch(e){
      console.error("[CivicWave] Realtime DB oxuma xətası:", e);
      window.CIVIC.setConn("error");
    }
  }

  async function dataUrlToBlob(u){ return await (await fetch(u)).blob(); }

  window.CIVIC_FB = {
    enabled: true,

    // write fields onto /reports/<id>
    async patch(id, obj){
      await fetch(`${BASE}/${NODE}/${id}.json`, {
        method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(obj)
      });
      load();
    },

    // manager close: upload fixed photo → Storage (REST), then write status + url + verdict
    async closeWithPhoto(id, file, byName, verdict){
      const blob = (file instanceof Blob) ? file : await dataUrlToBlob(file);
      const ext  = (file && file.name && file.name.split('.').pop()) || (blob.type.split('/')[1]) || 'jpg';
      const path = `${NODE}/${id}_fixed_${Date.now()}.${ext}`;
      const meta = await fetch(
        `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o?name=${encodeURIComponent(path)}`,
        { method:'POST', headers:{'Content-Type': blob.type || 'image/jpeg'}, body: blob }
      ).then(r=>{ if(!r.ok) throw new Error('Storage '+r.status); return r.json(); });
      const token = meta.downloadTokens;
      const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media${token?`&token=${token}`:''}`;
      await fetch(`${BASE}/${NODE}/${id}.json`, {
        method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          status:1, statusText:'resolved', fixedImageUrl:url, fixedStoragePath:path,
          resolvedBy: byName||'', resolvedAt: Date.now(), fixVerdict: verdict||null
        })
      });
      load();
      return url;
    }
  };

  // start once the app bridge is ready
  (function wait(){
    if(window.CIVIC && window.CIVIC.mapDoc){ load(); setInterval(load, POLL); }
    else setTimeout(wait, 50);
  })();
})();
