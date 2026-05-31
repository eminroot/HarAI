/* ============================================================
   CivicWave — Gemini fix-verification
   Given the original problem (category/severity/explanation) and the
   manager's "after" photo, asks Gemini whether the issue is resolved.
   Exposes window.CivicGemini.verifyFix(report, base64, mime).
   ============================================================ */
(function(){
  const cfg = window.GEMINI_CONFIG || {};
  const MODEL = cfg.model || "gemini-2.5-flash";

  function parseJson(text){
    if(!text) throw new Error("boş cavab");
    // strip ```json ... ``` fences if present
    let t = String(text).trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
    const a = t.indexOf('{'), b = t.lastIndexOf('}');
    if(a>=0 && b>a) t = t.slice(a, b+1);
    return JSON.parse(t);
  }

  async function verifyFix(report, base64, mime){
    if(!cfg.apiKey) throw new Error("Gemini açarı təyin edilməyib");
    const prompt =
`Sən "CivicWave" (Nərimanov rayonu, Bakı) şəhər problemləri YOXLAMA sistemisən.
Əvvəlcədən vətəndaş tərəfindən bildirilmiş problem:
- Kateqoriya: ${report.catName || report.cat}
- Ciddiyət: ${report.sevName || report.sev}
- AI təsviri: "${report.aiExplanation || ''}"

Aşağıdakı şəkil HƏMİN YERİN TƏMİRDƏN SONRAKI vəziyyətidir.
Şəkli diqqətlə analiz et və problemin TAM həll olunub-olunmadığını qiymətləndir.
Əgər problem hələ də görünürsə, yarımçıq həll olunubsa və ya şəkil əlaqəsiz/bulanıqdırsa, resolved=false yaz.

YALNIZ bu JSON formatında cavab ver, başqa heç nə yazma:
{"resolved": boolean, "confidence": number, "reason": string}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${cfg.apiKey}`;
    const body = {
      contents: [{ parts: [ {text: prompt}, {inline_data: {mime_type: mime || 'image/jpeg', data: base64}} ] }],
      generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
    };
    const res = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    if(!res.ok){ const t = await res.text(); throw new Error(`Gemini ${res.status}: ${t.slice(0,120)}`); }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map(p=>p.text).join('') || '';
    const j = parseJson(text);
    const confidence = Math.max(0, Math.min(100, Math.round(Number(j.confidence)||0)));
    const resolved = j.resolved === true || String(j.resolved).toLowerCase()==='true';
    return { approved: resolved && confidence >= 70, resolved, confidence, reason: j.reason || '', raw: text };
  }

  window.CivicGemini = { verifyFix, enabled: !!cfg.apiKey };
})();
