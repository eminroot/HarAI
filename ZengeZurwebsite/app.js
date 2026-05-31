/* ============================================================
   CivicWave — Komanda Mərkəzi  ·  app.js
   ============================================================ */

const NOW = new Date('2026-05-30T14:00:00');
const HOUR = 36e5;

/* ---------- ICONS (inline, 24px, 1.6 stroke) ---------- */
const I = {
  overview:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6V11h-6v9Zm0-16v4h6V4h-6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none"><path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="1.6"/></svg>',
  queue:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="7" cy="6" r="0" fill="currentColor"/></svg>',
  tasks:'<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 12l2.2 2.2L16 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  analytics:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 20V4M4 20h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 16l3-4 3 2 4-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  dept:'<svg viewBox="0 0 24 24" fill="none"><path d="M3 20h18M5 20V8l7-4 7 4v12" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 20v-5h6v5M10 11h.01M14 11h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  reports:'<svg viewBox="0 0 24 24" fill="none"><path d="M6 3h8l4 4v14H6V3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 3v4h4M9 13h6M9 16.5h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L12 16.77l-5.2 2.73.99-5.78-4.21-4.1 5.82-.85L12 3.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  audit:'<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.6"/><path d="M20 20l-4.5-4.5M9 11l1.5 1.5L14 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  /* categories */
  road:'<svg viewBox="0 0 24 24" fill="none"><path d="M7 21 9 3M17 21 15 3M12 5v2M12 11v2M12 17v2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  clean:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13M10 11v5M14 11v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  green:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 22v-7M12 15c0-4 3-6 7-6 0 4-3 6-7 6Zm0-2C12 9 9 6 5 6c0 4 3 7 7 7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  light:'<svg viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.2 1 2h6c0-.8.2-1.3 1-2A6 6 0 0 0 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  infra:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 21V8l6-4 6 4M16 21V11l4-2v12M4 21h16M8 12h.01M8 16h.01M12 12h.01M12 16h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  water:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  other:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.6"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.6-.9 1.4M12 16h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  /* misc */
  pin:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5 10 17.5 19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowL:'<svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  down:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  reassign:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 8h12l-3-3M20 16H8l3 3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 16V5m0 0L8 9m4-4 4 4M5 19h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.6"/></svg>',
  dots:'<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18" cy="12" r="1.6" fill="currentColor"/></svg>',
  spark:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="none"><path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  layers:'<svg viewBox="0 0 24 24" fill="none"><path d="m12 3 9 5-9 5-9-5 9-5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m3 13 9 5 9-5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  inbox:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 13 6 5h12l2 8v6H4v-6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 13h5a3 3 0 0 0 6 0h5" stroke="currentColor" stroke-width="1.6"/></svg>',
  signage:'<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="9" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 13v7M9 20h6M7.5 7.5h9M7.5 10h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  parks:'<svg viewBox="0 0 24 24" fill="none"><path d="M3 11h18M5 11v8M19 11v8M3 14h18M8 19v2M16 19v2M7 11V9a5 5 0 0 1 10 0v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  construction:'<svg viewBox="0 0 24 24" fill="none"><path d="M10 4h4l4 16H6L10 4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.8 10h6.4M7.6 15h8.8M4 20h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  seasonal:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M12 6l-2.4 1.4M12 6l2.4 1.4M12 18l-2.4-1.4M12 18l2.4 1.4M5.6 9.8 6 12.6M5.6 9.8 8 10M18.4 14.2 18 11.4M18.4 14.2 16 14M18.4 9.8 18 12.6M18.4 9.8 16 10M5.6 14.2 6 11.4M5.6 14.2 8 14" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
};

/* ---------- DOMAIN META ---------- */
/* derive a soft duotone palette from one base colour (keeps the editorial look
   while honouring the brief's per-category colours) */
function _hx(n){ n=Math.max(0,Math.min(255,Math.round(n))); return n.toString(16).padStart(2,'0'); }
function mix(a,b,t){
  const pa=[1,3,5].map(i=>parseInt(a.slice(i,i+2),16));
  const pb=[1,3,5].map(i=>parseInt(b.slice(i,i+2),16));
  return '#'+pa.map((v,i)=>_hx(v+(pb[i]-v)*t)).join('');
}
function mkpal(hex){ return {color:hex,
  c:mix(hex,'#000000',.14), bg:mix(hex,'#ffffff',.86), bg1:mix(hex,'#ffffff',.90),
  bg2:mix(hex,'#ffffff',.72), dark:mix(hex,'#141310',.20), cream:mix(hex,'#ffffff',.93)}; }

/* keyed by the mobile app's `categoryId` (see Firebase brief §6) */
const CAT = {
  roads:       {name:'Yollar və Asfalt',        dept:'Yol İstismar İdarəsi',         urg:9,  icon:'road',         ...mkpal('#3B5BDB')},
  water:       {name:'Su və Subasma',           dept:'Sukanal İdarəsi',              urg:10, icon:'water',        ...mkpal('#0EA5E9')},
  sanitation:  {name:'Təmizlik və Tullantılar', dept:'Təmizlik və Tullantı İdarəsi', urg:6,  icon:'clean',        ...mkpal('#F97316')},
  greenery:    {name:'Yaşıllıq və Ağaclar',     dept:'Yaşıllaşdırma İdarəsi',        urg:4,  icon:'green',        ...mkpal('#16A34A')},
  lighting:    {name:'Küçə İşıqlandırması',     dept:'İşıqlandırma İdarəsi',         urg:7,  icon:'light',        ...mkpal('#F59E0B')},
  facades:     {name:'Bina Fasadları',          dept:'Tikinti və Təmir İdarəsi',     urg:8,  icon:'infra',        ...mkpal('#8B5CF6')},
  signage:     {name:'Reklam və Vitrinlər',     dept:'Reklam və İnformasiya İdarəsi',urg:3,  icon:'signage',      ...mkpal('#EC4899')},
  parks:       {name:'Parklar və Avadanlıq',    dept:'Park və Bağ İdarəsi',          urg:4,  icon:'parks',        ...mkpal('#14B8A6')},
  construction:{name:'Tikinti Sahələri',        dept:'Tikinti və Təmir İdarəsi',     urg:7,  icon:'construction', ...mkpal('#CA8A04')},
  seasonal:    {name:'Buz və Mövsümi',          dept:'Kommunal Xidmət',              urg:6,  icon:'seasonal',     ...mkpal('#38BDF8')},
  other:       {name:'Digər',                   dept:'Kommunal Xidmət',              urg:3,  icon:'other',        ...mkpal('#64748B')},
};
/* map old internal keys (used by the demo seed) → real categoryIds */
const CATALIAS={road:'roads',clean:'sanitation',green:'greenery',light:'lighting',infra:'facades',water:'water',other:'other'};

const SEV = {
  low:{name:'Aşağı', cls:'sev--low', w:18},
  mid:{name:'Orta', cls:'sev--mid', w:46},
  high:{name:'Yüksək', cls:'sev--high', w:68},
  crit:{name:'Kritik', cls:'sev--crit', w:90},
};
const ST = {
  pending:{name:'Təsdiq gözləyir', cls:'st--pending', step:0},
  approved:{name:'Təsdiqləndi', cls:'st--approved', step:1},
  progress:{name:'Davam edir', cls:'st--progress', step:2},
  proof:{name:'Sübut gözləyir', cls:'st--proof', step:3},
  resolved:{name:'Həll edildi', cls:'st--resolved', step:4},
  rejected:{name:'Rədd edildi', cls:'st--rejected', step:-1},
};
/* dashboard status → value written back to Realtime DB (brief §6/§7 lifecycle) */
const ST_DB = {pending:'pending', approved:'approved', progress:'in_progress', proof:'in_progress', resolved:'resolved', rejected:'rejected'};
const DEPTS = [...new Set(Object.keys(CAT).map(k=>CAT[k].dept))];

const ROLES = {
  manager:{name:'Aysel Abbasova', title:'Rayon Meneceri', init:'AA', dept:null,
    can:{approve:true, reassign:'any', proof:true, close:true, export:true, allDept:true, uploadProof:false},
    nav:['overview','map','queue','analytics','reports','feedback','settings']},
  head:{name:'Rəşad Quliyev', title:'Departament Rəhbəri', init:'RQ', dept:'Yol İstismar İdarəsi',
    can:{approve:true, reassign:'dept', proof:true, close:true, export:true, allDept:false, uploadProof:false},
    nav:['overview','map','queue','analytics','reports','feedback','settings']},
  worker:{name:'Tural Əliyev', title:'Sahə İşçisi', init:'TƏ', dept:'Yol İstismar İdarəsi',
    can:{approve:false, reassign:false, proof:false, close:false, export:false, allDept:false, uploadProof:true},
    nav:['tasks','map','settings']},
};

/* ---------- DATA ---------- */
/* AI image-analysis explanation (what the model "sees" in the citizen photo).
   On the live build this text comes from Firestore; here it is composed per report. */
const AIEXP_T = {
  roads:'Şəkildə yol örtüyündə {sev} dərəcəli zədə aşkarlandı — asfaltda dərin çuxur və çatlar görünür. Səth nəqliyyat və piyadalar üçün risk yaradır.',
  sanitation:'Şəkildə yığılmış məişət tullantısı və konteyner ətrafına dağılmış zibil müəyyən edildi. Antisanitariya riski {sev} qiymətləndirilir.',
  greenery:'Şəkildə yaşıllıq sahəsində problem aşkarlandı — zədələnmiş/qurumuş bitki örtüyü və ya laxlamış ağac müşahidə olunur.',
  lighting:'Şəkildə işıqlandırma infrastrukturu təhlil edildi — sıradan çıxmış küçə lampası/dirək görünür. Gecə təhlükəsizliyi üçün risk {sev}.',
  facades:'Şəkildə bina fasadında problem aşkarlandı — suvaq tökülməsi, çat və ya zədələnmiş hissə müşahidə olunur.',
  water:'Şəkildə su/subasma problemi aşkarlandı — sızma, daşma və ya örtüksüz lyuk görünür. İctimai təhlükə səviyyəsi {sev}.',
  signage:'Şəkildə reklam lövhəsi/vitrin problemi aşkarlandı — zədələnmiş və ya icazəsiz quraşdırma müşahidə olunur.',
  parks:'Şəkildə park avadanlığında problem aşkarlandı — sınıq skamya, oyun avadanlığı və ya zədələnmiş element görünür.',
  construction:'Şəkildə tikinti sahəsi ilə bağlı problem aşkarlandı — qorunmayan zona, qalıqlar və ya təhlükə mənbəyi müşahidə olunur.',
  seasonal:'Şəkildə mövsümi/buz problemi aşkarlandı — sürüşkən səth və ya təhlükəli buzlaşma görünür.',
  other:'Şəkildə kommunal problem aşkarlandı; müvafiq departamentə yönləndirilməsi tövsiyə olunur.',
};
function AIEXP(cat,sev,cost){
  return (AIEXP_T[cat]||AIEXP_T.other).replace('{sev}', SEV[sev].name.toLowerCase()) +
    (cost? ` Vizual təhlilə əsasən təxmini bərpa dəyəri ${azn(cost)} proqnozlaşdırılıb.`:'');
}
let UID = 12500;
function R(title,cat,sev,status,worker,ageH,dlH,conf,cost,lat,lng,addr,note,reopened){
  cat = CATALIAS[cat] || cat;
  UID++;
  const created = new Date(NOW - ageH*HOUR);
  const deadline = new Date(created.getTime() + dlH*HOUR);
  const ageScore = Math.min(ageH/8, 14);
  const score = Math.min(100, Math.round(SEV[sev].w + CAT[cat].urg + ageScore));
  return {id:String(UID), docId:null, title, cat, sev, status, dept:CAT[cat].dept, worker, conf, cost,
    lat, lng, addr, note, aiExplanation:AIEXP(cat,sev,cost),
    imageUrl:null, fixedImageUrl:null, resolvedBy:null,
    reopened:!!reopened, created, deadline, score};
}
const REPORTS = [
  R('Dərin çuxur yağışdan sonra sürücülər üçün təhlükə','road','crit','progress','Tural Əliyev',38,30,96,640,40.4118,49.8512,'H. Əliyev pr. 123A','Maşınımın təkəri zədələndi, çuxur çox dərindir. Gecə görünmür.'),
  R('Asfalt örtüyü tamamilə dağılıb','road','high','approved','Tural Əliyev',14,48,89,420,40.4075,49.8489,'Təbriz küç. 45','Bütün döngə boyunca asfalt qopub.'),
  R('Səki daşları qalxıb, piyadalar büdrəyir','road','mid','pending',null,5,72,74,180,40.4142,49.8567,'Atatürk pr. 12','Yaşlı insanlar keçə bilmir.'),
  R('Küçə lampası 3 gündür yanmır','light','high','progress','Kamran Səfərov',52,40,91,95,40.4061,49.8541,'Gənclik m. ətrafı','Axşamlar tam qaranlıqdır, təhlükəsizdir narahatam.'),
  R('Park işıqlandırması işləmir','light','mid','proof','Kamran Səfərov',60,96,83,150,40.4098,49.8602,'Koala Parkı yaxınlığı','Uşaq meydançası qaranlıqda qalır.'),
  R('Konteynerlər həftədir boşaldılmayıb','clean','high','approved','Nigar Hüseynova',20,36,88,60,40.4129,49.8478,'Atatürk pr. 78','İy gəlir, küçəyə tökülüb.'),
  R('Tikinti tullantıları yığılıb qalıb','clean','mid','pending',null,8,72,71,220,40.4051,49.8523,'Ə. Rəcəbli küç. 9','Söküntü qalıqları piyada yolunu bağlayıb.'),
  R('Yarpaq və zibil kanalizasiyanı tıxayıb','clean','low','resolved','Nigar Hüseynova',96,120,79,40,40.4112,49.8559,'Ziya Bünyadov pr. 3','Yağışda su yığılırdı, indi təmizlənib.'),
  R('Qırılmış ağac yola düşmək üzrədir','green','crit','approved','Elçin Məmmədov',12,18,94,310,40.4088,49.8497,'Koroğlu m. yaxınlığı','Külək vurub, kökündən laxlayıb.'),
  R('Yaşıllıq sahəsi quruyub','green','low','pending',null,30,168,68,90,40.4135,49.8531,'Fətəli Xan Xoyski 22','Suvarma sistemi işləmir deyə.'),
  R('Skamyalar sınıb, parkda oturmaq olmur','green','low','progress','Elçin Məmmədov',44,144,72,130,40.4102,49.8585,'Mərkəzi Park','Bir neçə skamya tamamilə dağılıb.'),
  R('Kanalizasiya daşıb, su küçəyə çıxıb','water','crit','pending',null,3,12,97,880,40.4069,49.8508,'Qara Qarayev küç. 5','Pis iy yayılıb, su evlərə yaxınlaşır.',true),
  R('Su xətti zədəlidir, içməli su itir','water','high','progress','Səbuhi Rəhimov',26,30,90,540,40.4147,49.8546,'Nizami küç. 18','Yol kənarından fasiləsiz su axır.'),
  R('Yağış suyu drenajı tıxanıb','water','mid','proof','Səbuhi Rəhimov',70,84,81,260,40.4083,49.8474,'8 Noyabr pr. 41','Hər yağışda gölməçə yaranır.'),
  R('Avtobus dayanacağının damı uçub','infra','high','approved','Vüqar İsmayılov',18,48,87,470,40.4124,49.8593,'H. Əliyev pr. 200','Yağışdan qorunmaq mümkün deyil.'),
  R('Körpü məhəccəri sınıb, təhlükəlidir','infra','crit','progress','Vüqar İsmayılov',34,24,93,720,40.4057,49.8556,'Ziya Bünyadov körpüsü','Uşaqlar üçün çox təhlükəlidir.'),
  R('Divar uçqunu piyada yolunu bağlayıb','infra','mid','pending',null,9,72,75,290,40.4116,49.8462,'Səməd Vurğun 7','Keçid daralıb, təhlükə var.'),
  R('Yol nişanı əyilib, görünmür','road','low','resolved','Tural Əliyev',110,96,70,75,40.4093,49.8538,'Atatürk pr. 90','İndi düzəldilib, təşəkkürlər.'),
  R('Səki kafeləri qopub','road','mid','proof','Tural Əliyev',58,72,77,210,40.4138,49.8519,'Təbriz küç. 60','Yağışda sürüşkən olur.'),
  R('Zibil qutusu yanıb','clean','mid','rejected',null,80,72,55,0,40.4071,49.8571,'Gənclik m. 4','Şəkil aydın deyil, təkrar müraciət lazımdır.'),
  R('İşıqforun bir gözü işləmir','light','high','pending',null,6,40,86,160,40.4109,49.8484,'Atatürk × Nizami kəsişməsi','Sürücülər çaşır, qəza riski var.'),
  R('Park fəvvarəsi işləmir','water','low','progress','Səbuhi Rəhimov',48,168,66,140,40.4127,49.8577,'Mərkəzi Park','Uşaqlar üçün maraqlı idi, indi quru.'),
  R('Yolda dərin oyuq əmələ gəlib','road','high','progress','Tural Əliyev',22,42,88,380,40.4064,49.8531,'Koroğlu pr. 11','Velosipedlə keçmək təhlükəlidir.'),
  R('Ağacların budanması lazımdır','green','low','approved','Elçin Məmmədov',16,168,69,110,40.4145,49.8504,'Fətəli Xan Xoyski 50','Budaqlar elektrik xəttinə dəyir.'),
  R('Kanalizasiya qapağı yoxdur','water','crit','approved','Səbuhi Rəhimov',10,16,95,330,40.4079,49.8552,'8 Noyabr pr. 22','Açıq lyuk, gecə çox təhlükəli.'),
  R('Köhnə bina fasadından suvaq tökülür','infra','mid','resolved','Vüqar İsmayılov',120,96,73,250,40.4131,49.8463,'Səməd Vurğun 30','Bərkidildi, sağ olun.'),
];

/* ---------- HELPERS ---------- */
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function isOverdue(r){ return r.deadline < NOW && !['resolved','rejected'].includes(r.status); }
function ageStr(d){
  const h = Math.round((NOW-d)/HOUR);
  if(h<1) return 'indicə';
  if(h<24) return h+' saat öncə';
  const days = Math.round(h/24);
  return days+' gün öncə';
}
function deadlineStr(r){
  const diff = r.deadline - NOW;
  const h = Math.round(Math.abs(diff)/HOUR);
  const sign = diff<0 ? '-' : '';
  let val;
  if(h<24) val = h+' saat';
  else val = Math.round(h/24)+' gün';
  return {over:diff<0, text:sign+val, sub: diff<0?'gecikib':'qalıb'};
}
function fmtDate(d){
  return d.toLocaleDateString('az-Latn',{day:'2-digit',month:'short'})+', '+
         d.toLocaleTimeString('az',{hour:'2-digit',minute:'2-digit'});
}
function azn(n){ return n.toLocaleString('en-US')+' ₼'; }
function costStr(r){ return r.cost ? azn(r.cost) : '—'; }

/* deterministic duotone thumbnail per category (fallback when no real photo) */
function thumb(r){
  const c = CAT[r.cat] || CAT.other;
  const seed = String(r.id).split('').reduce((a,ch)=>((a*31+ch.charCodeAt(0))>>>0),7);
  const s = (n)=>((seed*9301+49297)%(n)); // tiny prng
  const scenes = {
    roads:`<rect width="100" height="60" y="40" fill="${c.dark}"/><path d="M0 70 H100" stroke="${c.cream}" stroke-width="3" stroke-dasharray="10 9"/><ellipse cx="${30+s(40)}" cy="78" rx="13" ry="6" fill="#1d2229"/>`,
    sanitation:`<rect x="38" y="40" width="24" height="34" rx="3" fill="${c.dark}"/><rect x="34" y="35" width="32" height="6" rx="3" fill="${c.dark}"/><circle cx="22" cy="80" r="3" fill="${c.dark}"/><circle cx="74" cy="76" r="2.5" fill="${c.dark}"/><circle cx="60" cy="85" r="2" fill="${c.dark}"/>`,
    greenery:`<rect width="100" height="22" y="78" fill="${c.dark}" opacity=".5"/><path d="M50 82 V52" stroke="${c.dark}" stroke-width="4"/><circle cx="50" cy="44" r="16" fill="${c.dark}"/><circle cx="38" cy="52" r="10" fill="${c.dark}"/><circle cx="62" cy="52" r="11" fill="${c.dark}"/>`,
    lighting:`<rect x="30" y="30" width="5" height="50" fill="${c.dark}"/><path d="M30 32 q14 -10 26 2 l-3 6 q-10 -8 -20 -2Z" fill="${c.dark}"/><path d="M52 40 L70 80 L34 80Z" fill="${c.cream}" opacity=".6"/>`,
    facades:`<rect x="26" y="34" width="48" height="46" fill="${c.dark}"/><path d="M50 34 V80 M40 40 L60 60 M60 44 L46 70" stroke="${c.cream}" stroke-width="1.5" opacity=".5"/><rect x="34" y="42" width="8" height="8" fill="${c.cream}" opacity=".4"/><rect x="58" y="42" width="8" height="8" fill="${c.cream}" opacity=".4"/>`,
    water:`<path d="M0 64 q12 -8 25 0 t25 0 t25 0 t25 0 V100 H0Z" fill="${c.dark}" opacity=".85"/><path d="M0 74 q12 -7 25 0 t25 0 t25 0 t25 0 V100 H0Z" fill="${c.dark}"/>`,
    signage:`<rect x="28" y="28" width="44" height="26" rx="2" fill="${c.dark}"/><rect x="48" y="54" width="4" height="24" fill="${c.dark}"/><path d="M34 37h32M34 45h22" stroke="${c.cream}" stroke-width="3" opacity=".7"/>`,
    parks:`<rect width="100" height="20" y="80" fill="${c.dark}" opacity=".45"/><rect x="28" y="52" width="44" height="6" fill="${c.dark}"/><rect x="28" y="62" width="44" height="6" fill="${c.dark}"/><rect x="30" y="56" width="4" height="24" fill="${c.dark}"/><rect x="66" y="56" width="4" height="24" fill="${c.dark}"/>`,
    construction:`<path d="M44 40 L56 40 L64 80 L36 80 Z" fill="${c.dark}"/><path d="M42 56 h16 M39 68 h22" stroke="${c.cream}" stroke-width="4" opacity=".85"/>`,
    seasonal:`<g stroke="${c.dark}" stroke-width="3" stroke-linecap="round"><path d="M28 42v18M19 51h18M28 45l-5 3M28 45l5 3"/><path d="M64 50v20M55 60h18M64 53l-5 3M64 53l5 3"/></g>`,
    other:`<circle cx="50" cy="55" r="20" fill="none" stroke="${c.dark}" stroke-width="4"/><path d="M44 50 a6 6 0 1 1 8 6 v4" fill="none" stroke="${c.dark}" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="66" r="2.4" fill="${c.dark}"/>`,
  };
  return `<svg class="thumbsvg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.bg1}"/><stop offset="1" stop-color="${c.bg2}"/></linearGradient></defs>
    <rect width="100" height="100" fill="url(#g${seed})"/>
    ${scenes[r.cat]||scenes.other}
    <g opacity=".14" stroke="${c.dark}" stroke-width="1">${Array.from({length:6},(_,i)=>`<line x1="${i*22-10}" y1="0" x2="${i*22+30}" y2="100"/>`).join('')}</g>
  </svg>`;
}

/* photo: real Storage image when available, else the deterministic SVG tile.
   `which`='main' → original citizen photo (imageUrl); 'fixed' → resolution photo. */
function photo(r, which='main'){
  const url = which==='fixed' ? r.fixedImageUrl : r.imageUrl;
  if(url) return `<img class="photo-img" src="${esc(url)}" alt="" loading="lazy" style="background:${CAT[r.cat].bg2}" onerror="this.classList.add('photo-img--fail')">`;
  return thumb(which==='fixed' ? {...r,id:String(r.id)+'fx'} : r);
}

/* SVG progress ring */
function ring(pct, size=46, stroke=4, color='var(--teal)'){
  const r = (size-stroke)/2, c = 2*Math.PI*r, off = c*(1-pct/100);
  return `<svg viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--canvas-2)" stroke-width="${stroke}"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 ${size/2} ${size/2})"/></svg>`;
}
/* sparkline */
function spark(data, color='var(--teal)'){
  const w=62,h=24, mn=Math.min(...data), mx=Math.max(...data), rng=(mx-mn)||1;
  const pts = data.map((v,i)=>`${(i/(data.length-1)*w).toFixed(1)},${(h-2-((v-mn)/rng)*(h-4)).toFixed(1)}`).join(' ');
  return `<svg class="kpi__spark" viewBox="0 0 ${w} ${h}" fill="none"><polyline points="${pts}" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/></svg>`;
}
/* full-bleed trend line for the KPI ledger (own band, never overlaps text) */
function trendline(data, hex){
  const w=120,h=30, mn=Math.min(...data), mx=Math.max(...data), rng=(mx-mn)||1;
  const pts = data.map((v,i)=>[ +(i/(data.length-1)*w).toFixed(2), +(h-4-((v-mn)/rng)*(h-9)).toFixed(2) ]);
  const line = pts.map(p=>p.join(',')).join(' ');
  const area = `0,${h} `+line+` ${w},${h}`;
  const id = 't'+hex.replace('#','');
  const last = pts[pts.length-1];
  return `<svg class="lcell__trend" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hex}" stop-opacity=".13"/><stop offset="1" stop-color="${hex}" stop-opacity="0"/></linearGradient></defs>
    <polygon points="${area}" fill="url(#${id})"/>
    <polyline points="${line}" fill="none" stroke="${hex}" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${last[0]}" cy="${last[1]}" r="2.4" fill="${hex}" vector-effect="non-scaling-stroke"/>
  </svg>`;
}
/* interactive pie chart — on-slice percentage labels, hover-to-explode with the
   rest dimmed, two-way sync with the legend (pieHi). Used by the overview. */
function pieChart(segs, size=176){
  const tot = segs.reduce((s,x)=>s+x.v,0)||1;
  const cx=size/2, cy=size/2, r=size/2-10;   // padding leaves room for the pop-out
  if(segs.length===1){
    return `<svg class="pie" viewBox="0 0 ${size} ${size}">
      <circle class="pie-slice" data-i="0" cx="${cx}" cy="${cy}" r="${(r).toFixed(2)}" fill="${segs[0].color}" style="--tx:0px;--ty:0px" onmouseenter="pieHi(this,1)" onmouseleave="pieHi(this,0)"><title>${esc(segs[0].name)} · ${segs[0].v} (100%)</title></circle>
      <text class="pie-pct" data-i="0" x="${cx}" y="${cy}">100%</text></svg>`;
  }
  let a0=-Math.PI/2, paths='', labels='';
  segs.forEach((s,i)=>{
    const frac=s.v/tot, a1=a0+frac*2*Math.PI, mid=(a0+a1)/2, pct=Math.round(frac*100);
    const x0=cx+r*Math.cos(a0), y0=cy+r*Math.sin(a0);
    const x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
    const large=frac>0.5?1:0;
    const tx=(Math.cos(mid)*10).toFixed(1), ty=(Math.sin(mid)*10).toFixed(1);
    paths+=`<path class="pie-slice" data-i="${i}" d="M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z" fill="${s.color}" style="--tx:${tx}px;--ty:${ty}px" onmouseenter="pieHi(this,1)" onmouseleave="pieHi(this,0)"><title>${esc(s.name)} · ${s.v} (${pct}%)</title></path>`;
    if(pct>=7){
      const lr=r*0.62, lx=cx+lr*Math.cos(mid), ly=cy+lr*Math.sin(mid);
      labels+=`<text class="pie-pct" data-i="${i}" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" style="--tx:${tx}px;--ty:${ty}px">${pct}%</text>`;
    }
    a0=a1;
  });
  return `<svg class="pie" viewBox="0 0 ${size} ${size}">${paths}${labels}</svg>`;
}
/* highlight a pie slice + its legend row together (called inline from both).
   The pop-out translate is applied inline here: var() inside a stylesheet
   transform rule resolves to identity on SVG paths in some engines, but inline
   it works reliably. Dimming/opacity stays in CSS. */
function pieHi(el, on){
  const w=el.closest('.pie-wrap'); if(!w) return;
  const i=el.dataset.i;
  w.classList.toggle('is-hovering', !!on);
  w.querySelectorAll('[data-i]').forEach(n=>{
    const hit = !!on && n.dataset.i===i;
    n.classList.toggle('is-hi', hit);
    // only SVG slices/labels carry --tx/--ty; legend rows ignore this harmlessly
    if(n.tagName==='path' || n.tagName==='circle' || n.tagName==='text'){
      n.style.transform = hit ? 'translate(var(--tx),var(--ty))' : '';
    }
  });
}
const sevDot = r => `<span class="sev-dot ${SEV[r.sev].cls}" style="background:var(--_c)"></span>`;
const sevTag = r => `<span class="pill sevtag ${SEV[r.sev].cls}"><span class="sev-dot"></span>${SEV[r.sev].name}</span>`;
const statusTag = r => `<span class="status ${ST[r.status].cls}"><span>${ST[r.status].name}</span></span>`;
const glyph = cat => I[(CAT[cat]||CAT.other).icon] || I.other;
const catIcon = r => `<span class="cat__ic" style="--_cbg:${(CAT[r.cat]||CAT.other).bg};--_cc:${(CAT[r.cat]||CAT.other).c}">${glyph(r.cat)}</span>`;
const initials = n => n.split(' ').map(w=>w[0]).slice(0,2).join('');

/* ---------- STATE ---------- */
const state = {
  role:'manager',
  view:'overview',
  detailReturn:'overview',
  sel:null,
  proof:{before:null, after:null},
  fix:{url:null, file:null, verdict:null, verifying:false, error:null, manual:false},
  filters:{sev:'all', cat:'all', status:'all', dept:'all', q:''},
  sort:{key:'score', dir:'desc'},
  mapLayer:'pins',
};
let map=null, mapMarkers=null, mapHeat=null;

/* role-scoped reports */
function scopedReports(){
  const role = ROLES[state.role];
  if(state.role==='worker') return REPORTS.filter(r=>r.worker===role.name);
  if(state.role==='head') return REPORTS.filter(r=>r.dept===role.dept);
  return REPORTS.slice();
}
function filtered(){
  const f = state.filters;
  let rows = scopedReports().filter(r=>{
    if(f.sev!=='all' && r.sev!==f.sev) return false;
    if(f.cat!=='all' && r.cat!==f.cat) return false;
    if(f.status!=='all' && r.status!==f.status) return false;
    if(f.dept!=='all' && r.dept!==f.dept) return false;
    if(f.q){
      const q=f.q.toLowerCase();
      if(!(('#'+r.id).includes(q)||r.title.toLowerCase().includes(q)||r.addr.toLowerCase().includes(q))) return false;
    }
    return true;
  });
  const {key,dir}=state.sort, m=dir==='asc'?1:-1;
  rows.sort((a,b)=>{
    let av,bv;
    if(key==='deadline'){av=a.deadline;bv=b.deadline;}
    else if(key==='age'){av=a.created;bv=b.created;}
    else if(key==='score'){av=a.score;bv=b.score;}
    else if(key==='conf'){av=a.conf;bv=b.conf;}
    else {av=a[key];bv=b[key];}
    return av>bv?m:av<bv?-m:0;
  });
  return rows;
}

/* ============================================================
   RENDER — SHELL
   ============================================================ */
const NAVMETA = {
  overview:{label:'Ümumi Baxış', icon:'overview', eyebrow:'Komanda Mərkəzi'},
  map:{label:'Canlı Xəritə', icon:'map', eyebrow:'Coğrafi Görünüş'},
  queue:{label:'Sorğu Növbəsi', icon:'queue', eyebrow:'Müraciətlər'},
  tasks:{label:'Tapşırıqlarım', icon:'tasks', eyebrow:'Sahə İşləri'},
  analytics:{label:'Analitika', icon:'analytics', eyebrow:'Göstəricilər'},
  reports:{label:'Hesabatlar', icon:'reports', eyebrow:'İxrac'},
  feedback:{label:'Vətəndaş Rəyləri', icon:'star', eyebrow:'Məmnuniyyət'},
  settings:{label:'Parametrlər', icon:'settings', eyebrow:'Sistem'},
};
const NAVGROUPS = [
  {title:'İdarəetmə', items:['overview','tasks','map','queue']},
  {title:'Analiz', items:['analytics','reports','feedback']},
  {title:'Sistem', items:['settings']},
];

function renderNav(){
  const role = ROLES[state.role];
  const allowed = role.nav;
  const activeView = state.view==='detail' ? state.detailReturn : state.view;
  let html='';
  for(const g of NAVGROUPS){
    const items = g.items.filter(i=>allowed.includes(i));
    if(!items.length) continue;
    html += `<div class="nav__group">${g.title}</div>`;
    for(const key of items){
      const m=NAVMETA[key];
      let badge='';
      if(key==='queue'){ const n=scopedReports().filter(r=>r.status==='pending').length; if(n) badge=`<span class="navitem__alert">${n}</span>`; }
      if(key==='tasks'){ const n=scopedReports().filter(r=>!['resolved','rejected'].includes(r.status)).length; badge=`<span class="navitem__count">${n}</span>`; }
      if(key==='map'){ const n=scopedReports().filter(isOverdue).length; if(n) badge=`<span class="navitem__alert">${n}</span>`; }
      html += `<button class="navitem ${activeView===key?'is-active':''}" data-nav="${key}">${I[m.icon]}<span>${m.label}</span>${badge}</button>`;
    }
  }
  $('#nav').innerHTML = html;
}

function renderRole(){
  const role = ROLES[state.role];
  $('#roleAvatar').textContent = role.init;
  $('#roleName').textContent = role.name;
  $('#roleTitle').textContent = role.title;
  $('#roleMenu').innerHTML = `<div class="rolemenu__head">Rol seç · Giriş</div>` +
    Object.entries(ROLES).map(([k,r])=>{
      const grad = k==='manager'?'linear-gradient(145deg,#2C6B71,#0F5057)':k==='head'?'linear-gradient(145deg,#C98A1E,#9A6B14)':'linear-gradient(145deg,#C9402F,#933124)';
      return `<button class="roleopt ${state.role===k?'is-active':''}" data-role="${k}">
        <span class="roleopt__av" style="background:${grad}">${r.init}</span>
        <span class="roleopt__meta"><span class="roleopt__name">${r.name}</span><span class="roleopt__role">${r.title}</span></span>
        <span class="roleopt__check">${I.check}</span>
      </button>`;
    }).join('');
}

function render(){
  const v = $('#view');
  v.classList.remove('view-enter'); void v.offsetWidth; v.classList.add('view-enter');
  if(state.view==='detail'){
    $('#viewEyebrow').textContent = 'Müraciət';
    $('#viewTitle').textContent = state.sel ? ('#'+state.sel.id) : 'Müraciət';
    renderNav();
    v.innerHTML = viewDetail();
    initMiniMap();
    v.scrollTop = 0;
    return;
  }
  const m = NAVMETA[state.view];
  $('#viewEyebrow').textContent = m.eyebrow;
  $('#viewTitle').textContent = m.label;
  renderNav();
  const fn = {overview:viewOverview, map:viewMap, queue:viewQueue, tasks:viewTasks,
    analytics:viewAnalytics, reports:viewReports, feedback:viewFeedback, settings:viewSettings}[state.view];
  v.innerHTML = fn();
  if(state.view==='map') initMap();
}

/* ============================================================
   VIEW · OVERVIEW
   ============================================================ */
function viewOverview(){
  const all = scopedReports();
  const open = all.filter(r=>!['resolved','rejected'].includes(r.status));
  const pending = all.filter(r=>r.status==='pending');
  const progress = all.filter(r=>r.status==='progress');
  const overdue = all.filter(isOverdue);
  const resolvedWk = all.filter(r=>r.status==='resolved');
  const avgH = 19;

  /* —— editorial "Pulse" hero + hairline metric rail (replaces the box row) —— */
  const mcell = (lab,val,dir,delta,hex)=>`<div class="mcell">
    <span class="mcell__lab"><span class="mcell__tick" style="background:${hex}"></span>${lab}</span>
    <span class="mcell__fig" data-count="${val}">0</span>
    <span class="mcell__delta ${dir==='down'?'down':'up'}">${dir==='down'?I.down:I.up}${delta}</span>
  </div>`;
  const heroTrend = [8,9,11,10,13,12,15, Math.max(1,open.length)];
  const kpis = `<section class="pulse">
    <div class="pulse__hero">
      <div class="pulse__top">
        <span class="pulse__kicker">Açıq müraciətlər</span>
        <span class="pulse__live"><span class="pulse__dot"></span>Canlı</span>
      </div>
      <div class="pulse__figwrap">
        <span class="pulse__fig" data-count="${open.length}">0</span>
        <span class="pulse__delta up">${I.up}12.5%<em>keçən həftəyə</em></span>
      </div>
      <div class="pulse__cap">Hazırda həll gözləyən aktiv müraciətlər — Nərimanov rayonu üzrə canlı vəziyyət.</div>
      ${heroSpark(heroTrend)}
    </div>
    <div class="pulse__rail">
      ${mcell('Təsdiq gözləyən', pending.length,'up','3 yeni','#C99A2E')}
      ${mcell('Davam edən', progress.length,'up','8.3%','#2A66B8')}
      ${mcell('Gecikmiş', overdue.length,'down','2 azalıb','#C8442A')}
      ${mcell('Bu həftə həll', resolvedWk.length,'up','18.3%','#3E7D5A')}
    </div>
  </section>`;

  /* feed */
  const feed = [...all].sort((a,b)=>b.created-a.created).slice(0,6).map(r=>`
    <div class="feedrow" data-open="${r.id}">
      <div class="feedrow__thumb">${photo(r)}</div>
      <div class="feedrow__body">
        <div class="feedrow__top"><span class="feedrow__id">#${r.id}</span>${sevTag(r)}</div>
        <div class="feedrow__title">${esc(r.title)}</div>
        <div class="feedrow__meta"><span>${CAT[r.cat].name}</span><span>·</span><span class="mono">${esc(r.addr)}</span></div>
      </div>
      <div class="feedrow__age">${ageStr(r.created)}</div>
    </div>`).join('');

  /* at-risk */
  const risk = [...overdue,...all.filter(r=>!isOverdue(r)&&!['resolved','rejected'].includes(r.status)&&deadlineStr(r).text.includes('saat'))]
    .filter((v,i,a)=>a.indexOf(v)===i).slice(0,5).map(r=>{
      const d=deadlineStr(r);
      return `<div class="riskrow" data-open="${r.id}">
        <div class="riskrow__bar" style="background:${d.over?'var(--vermilion)':'var(--sev-high)'}"></div>
        <div class="riskrow__body"><div class="riskrow__title">${esc(r.title)}</div><div class="riskrow__sub">#${r.id} · ${esc(r.worker||'təyin olunmayıb')}</div></div>
        <div class="riskrow__time"><div class="riskrow__big" style="color:${d.over?'var(--vermilion)':'var(--sev-high)'}">${d.text}</div><div class="riskrow__small">${d.sub}</div></div>
      </div>`;
    }).join('') || `<div class="empty"><p>Risk altında müraciət yoxdur 🎉</p></div>`;

  /* category breakdown → pie chart */
  const byCat = Object.keys(CAT).map(k=>({k, n:all.filter(r=>r.cat===k).length})).filter(x=>x.n).sort((a,b)=>b.n-a.n);
  const tot = byCat.reduce((s,x)=>s+x.n,0);
  const catSegs = byCat.map(x=>({v:x.n, color:CAT[x.k].c, name:CAT[x.k].name}));
  const catLegend = catSegs.map((s,i)=>{
    const pct=Math.round(s.v/tot*100);
    return `<div class="dleg" data-i="${i}" onmouseenter="pieHi(this,1)" onmouseleave="pieHi(this,0)"><span class="dleg__sw" style="background:${s.color}"></span><span class="dleg__n">${s.name}</span><span class="dleg__v">${s.v} · ${pct}%</span></div>`;
  }).join('');

  return `${kpis}
    <div class="grid-2">
      <div class="card">
        <div class="card__head"><span class="card__title">Son Müraciətlər</span><button class="sec__action" data-nav="queue">Hamısına bax ${I.arrow}</button></div>
        <div class="card__body"><div class="feed">${feed}</div></div>
      </div>
      <div class="stack" style="gap:22px">
        <div class="card">
          <div class="card__head"><span class="card__title">Risk altında</span><span class="card__sub" style="display:inline-flex;align-items:center;gap:6px;color:${overdue.length?'var(--vermilion)':'var(--ink-3)'};font-weight:600">${overdue.length?'<span style="width:7px;height:7px;border-radius:50%;background:var(--vermilion)"></span>':''}${overdue.length} gecikmiş</span></div>
          <div class="card__body card__body--pad"><div class="risk">${risk}</div></div>
        </div>
        <div class="card">
          <div class="card__head"><span class="card__title">Kateqoriyalar üzrə</span><span class="card__sub">${tot} müraciət</span></div>
          <div class="card__body card__body--pad"><div class="pie-wrap">${pieChart(catSegs)}<div class="pie-legend">${catLegend}</div></div></div>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   VIEW · QUEUE
   ============================================================ */
function toolbar(){
  const f=state.filters;
  const sevSeg = ['all','low','mid','high','crit'].map(s=>{
    const lbl = s==='all'?'Hamısı':SEV[s].name;
    const dot = s==='all'?'':`<span class="seg-dot" style="background:var(--_c)"></span>`;
    const cls = s==='all'?'':SEV[s].cls;
    return `<button class="segbtn ${cls} ${f.sev===s?'is-active':''}" data-fsev="${s}">${dot}${lbl}</button>`;
  }).join('');
  const present = new Set(scopedReports().map(r=>r.cat));
  const catOpts = `<option value="all">Bütün kateqoriyalar</option>`+Object.entries(CAT).filter(([k])=>present.has(k)).map(([k,c])=>`<option value="${k}" ${f.cat===k?'selected':''}>${c.name}</option>`).join('');
  const stOpts = `<option value="all">Bütün statuslar</option>`+Object.entries(ST).map(([k,s])=>`<option value="${k}" ${f.status===k?'selected':''}>${s.name}</option>`).join('');
  const showDept = ROLES[state.role].can.allDept;
  const deptOpts = showDept?`<div class="selectwrap"><select data-fdept><option value="all">Bütün departamentlər</option>${DEPTS.map(d=>`<option value="${d}" ${f.dept===d?'selected':''}>${d}</option>`).join('')}</select></div>`:'';
  return `<div class="toolbar">
    <div class="segment">${sevSeg}</div>
    <div class="selectwrap"><select data-fcat>${catOpts}</select></div>
    <div class="selectwrap"><select data-fstatus>${stOpts}</select></div>
    ${deptOpts}
    <div class="toolbar__spacer"></div>
    <span class="toolbar__count" id="qCount"></span>
  </div>`;
}
function viewQueue(){
  const rows = filtered();
  const headers = [
    {k:'', l:'', sort:false, w:'50px'},
    {k:'title', l:'Müraciət', sort:true},
    {k:'sev', l:'Ciddilik', sort:true},
    {k:'status', l:'Status', sort:true},
    {k:'worker', l:'Təyinat', sort:true},
    {k:'conf', l:'AI', sort:true},
    {k:'score', l:'Prioritet', sort:true},
    {k:'deadline', l:'Son tarix', sort:true},
  ];
  const ths = headers.map(h=>{
    const sorted = state.sort.key===h.k;
    const caret = state.sort.dir==='asc'?'▲':'▼';
    return `<th class="${h.sort?'sortable':''} ${sorted?'is-sorted':''}" ${h.sort?`data-sort="${h.k}"`:''} ${h.w?`style="width:${h.w}"`:''}>${h.l}${h.sort?`<span class="sortcaret">${caret}</span>`:''}</th>`;
  }).join('');

  const body = rows.length ? rows.map(r=>{
    const d=deadlineStr(r);
    const sw = r.worker?`<div class="tcell-assignee"><span class="miniav">${initials(r.worker)}</span><div><div class="tcell-assignee__t">${esc(r.worker.split(' ')[0])} ${esc(r.worker.split(' ')[1]?.[0]||'')}.</div><div class="tcell-assignee__d">${CAT[r.cat].dept.split(' ')[0]}</div></div></div>`
      :`<span class="unassigned">təyin olunmayıb</span>`;
    return `<tr class="${isOverdue(r)?'is-overdue':''}" data-open="${r.id}">
      <td><div class="tcell-thumb">${photo(r)}</div></td>
      <td><div style="display:flex;align-items:center;gap:9px">${catIcon(r)}<div><div class="tcell-title">${esc(r.title)}</div><div class="tcell-loc">${I.pin}<span class="mono">#${r.id} · ${esc(r.addr)}</span></div></div></div></td>
      <td>${sevTag(r)}</td>
      <td>${statusTag(r)}</td>
      <td>${sw}</td>
      <td><div class="confbar"><div class="confbar__ring">${ring(r.conf,26,3,r.conf>85?'var(--sev-low)':r.conf>70?'var(--sev-mid)':'var(--sev-high)')}</div><span class="confbar__t">${r.conf}%</span></div></td>
      <td><div class="score"><span class="score__num" style="color:${r.score>80?'var(--vermilion)':r.score>55?'var(--sev-high)':'var(--ink-2)'}">${r.score}</span><div class="score__bar"><div class="score__fill" style="width:${r.score}%;background:${r.score>80?'var(--vermilion)':r.score>55?'var(--sev-high)':'var(--teal)'}"></div></div></div></td>
      <td><div class="deadline ${d.over?'is-over':''}">${d.text}<small>${d.over?'GECİKİB':d.sub}</small></div></td>
    </tr>`;
  }).join('') : `<tr><td colspan="8"><div class="empty">${I.inbox}<h4>Nəticə tapılmadı</h4><p>Filtrləri dəyişməyi yoxlayın.</p></div></td></tr>`;

  return `${toolbar()}
    <div class="tablecard"><table class="table"><thead><tr>${ths}</tr></thead><tbody>${body}</tbody></table></div>`;
}

/* ============================================================
   VIEW · MY TASKS (worker)
   ============================================================ */
function viewTasks(){
  const all = scopedReports().filter(r=>!['resolved','rejected'].includes(r.status))
    .sort((a,b)=>a.deadline-b.deadline);
  if(!all.length) return `<div class="empty" style="padding:100px">${I.check}<h4>Bütün tapşırıqlar tamamlandı</h4><p>Hazırda sizə təyin olunmuş aktiv iş yoxdur.</p></div>`;
  const cards = all.map(r=>{
    const d=deadlineStr(r);
    const col=d.over?'var(--vermilion)':d.text.includes('saat')?'var(--sev-high)':'var(--teal)';
    const bg=d.over?'var(--vermilion-tint)':d.text.includes('saat')?'var(--sev-high-bg)':'var(--teal-tint)';
    const canUp = r.status==='approved'||r.status==='progress';
    return `<div class="taskcard" data-open="${r.id}">
      <div class="taskcard__media">${photo(r)}<div class="ttag">${sevTag(r)}</div></div>
      <div class="taskcard__body">
        <div style="display:flex;align-items:center;gap:8px">${catIcon(r)}<span class="mono" style="font-size:11px;color:var(--ink-3)">#${r.id}</span>${statusTag(r)}</div>
        <div class="taskcard__title">${esc(r.title)}</div>
        <div class="taskcard__loc">${I.pin}${esc(r.addr)}</div>
        <div class="countdown">
          <div class="countdown__ic" style="background:${bg};color:${col}">${I.clock}</div>
          <div class="countdown__t"><div class="countdown__big" style="color:${col}">${d.text}</div><div class="countdown__lbl">${d.over?'gecikib · təcili':'son tarixə qalıb'}</div></div>
          ${canUp?`<button class="btn btn--primary btn--sm" data-proof="${r.id}">${I.upload} Sübut</button>`:''}
        </div>
      </div>
    </div>`;
  }).join('');
  return `<div class="taskgrid">${cards}</div>`;
}

/* ============================================================
   VIEW · MAP
   ============================================================ */
function viewMap(){
  return `${toolbar()}
    <div class="maplayout">
      <div class="mapwrap">
        <div id="map"></div>
        <div class="maptoggle">
          <button class="btn btn--ghost btn--sm ${state.mapLayer==='pins'?'is-on':''}" data-maplayer="pins" style="${state.mapLayer==='pins'?'border-color:var(--teal);color:var(--teal)':''}">${I.pin} Nöqtələr</button>
          <button class="btn btn--ghost btn--sm" data-maplayer="heat" style="${state.mapLayer==='heat'?'border-color:var(--teal);color:var(--teal)':''}">${I.layers} Sıxlıq</button>
        </div>
        <div class="maplegend">
          <h5>Ciddilik səviyyəsi</h5>
          <div class="legrow"><span class="legdot" style="background:var(--sev-low)"></span>Aşağı</div>
          <div class="legrow"><span class="legdot" style="background:var(--sev-mid)"></span>Orta</div>
          <div class="legrow"><span class="legdot" style="background:var(--sev-high)"></span>Yüksək</div>
          <div class="legrow"><span class="legdot" style="background:var(--sev-crit)"></span>Çox yüksək</div>
        </div>
      </div>
      <div class="mappanel" id="mapPanel"></div>
    </div>`;
}
const SEVHEX = {low:'#2E9266', mid:'#C98A1E', high:'#D97A2B', crit:'#C9402F'};
function initMap(){
  const rows = filtered();
  if(map){ map.remove(); map=null; }
  map = L.map('map',{zoomControl:false, attributionControl:false}).setView([40.4102,49.8535],14);
  L.control.zoom({position:'bottomright'}).addTo(map);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{
    maxZoom:19, subdomains:'abcd'
  }).addTo(map);
  L.control.attribution({position:'bottomright',prefix:false}).addAttribution('© OpenStreetMap · CARTO').addTo(map);

  mapMarkers = L.layerGroup();
  mapHeat = L.layerGroup();
  rows.forEach(r=>{
    const col=SEVHEX[r.sev];
    const sz = r.sev==='crit'?34:r.sev==='high'?30:26;
    const icon = L.divIcon({className:'', html:`<div class="mappin" style="width:${sz}px;height:${sz}px;background:${col}">${glyph(r.cat).replace('<svg','<svg style="width:'+(sz*0.42)+'px;height:'+(sz*0.42)+'px"')}</div>`, iconSize:[sz,sz], iconAnchor:[sz/2,sz]});
    const mk = L.marker([r.lat,r.lng],{icon});
    mk.on('click',()=>openDetail(r.id));
    mk.bindTooltip(`<b>#${r.id}</b> · ${esc(r.title)}`,{direction:'top',offset:[0,-sz]});
    mapMarkers.addLayer(mk);
    mapHeat.addLayer(L.circleMarker([r.lat,r.lng],{radius:sz*0.9, color:'transparent', fillColor:col, fillOpacity:0.18}));
    mapHeat.addLayer(L.circleMarker([r.lat,r.lng],{radius:sz*0.45, color:'transparent', fillColor:col, fillOpacity:0.28}));
  });
  (state.mapLayer==='pins'?mapMarkers:mapHeat).addTo(map);

  $('#mapPanel').innerHTML = `<div class="card"><div class="card__head"><span class="card__title">Xəritədə ${rows.length} nöqtə</span></div><div class="card__body">`+
    rows.slice(0,40).map(r=>`<div class="feedrow" data-open="${r.id}" data-fly="${r.lat},${r.lng}">
      <div class="feedrow__thumb">${photo(r)}</div>
      <div class="feedrow__body"><div class="feedrow__top"><span class="feedrow__id">#${r.id}</span>${sevTag(r)}</div><div class="feedrow__title" style="font-size:12.5px">${esc(r.title)}</div><div class="feedrow__meta"><span class="mono">${esc(r.addr)}</span></div></div>
    </div>`).join('')+`</div></div>`;
}

/* ============================================================
   VIEW · ANALYTICS
   ============================================================ */
/* smooth cubic path through points [[x,y],…] */
function smoothPath(pts){
  if(pts.length<2) return '';
  let d='M'+pts[0][0].toFixed(1)+','+pts[0][1].toFixed(1);
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[i-1]||pts[i], p1=pts[i], p2=pts[i+1], p3=pts[i+2]||p2;
    const c1x=p1[0]+(p2[0]-p0[0])/6, c1y=p1[1]+(p2[1]-p0[1])/6;
    const c2x=p2[0]-(p3[0]-p1[0])/6, c2y=p2[1]-(p3[1]-p1[1])/6;
    d+=` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
function areaChart(data, color='#0F5057'){
  const W=600, H=210, padT=14, padB=10;
  const mx=Math.max(...data)*1.18, mn=0;
  const step=W/(data.length-1);
  const pts=data.map((v,i)=>[i*step, padT+(H-padT-padB)*(1-(v-mn)/(mx-mn))]);
  const line=smoothPath(pts);
  const area=line+` L${W},${H} L0,${H} Z`;
  const grid=[0,.25,.5,.75,1].map(t=>{const y=(padT+(H-padT-padB)*t).toFixed(1);return `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="var(--hair-2)" stroke-width="1"/>`;}).join('');
  const last=pts[pts.length-1];
  return `<svg class="areachart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".16"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    ${grid}
    <path class="area-fill" d="${area}" fill="url(#areaGrad)"/>
    <path class="area-line" d="${line}" fill="none" stroke="${color}" stroke-width="2.6" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="area-dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4.5" fill="var(--surface)" stroke="${color}" stroke-width="2.6" vector-effect="non-scaling-stroke"/>
  </svg>`;
}
/* wide draw-in area chart for the dark Pulse hero (paper/gold on espresso) */
function heroSpark(data){
  const W=560,H=118,pad=8;
  const mx=Math.max(...data), mn=Math.min(...data), rng=(mx-mn)||1;
  const step=W/(data.length-1);
  const pts=data.map((v,i)=>[ i*step, H-pad-((v-mn)/rng)*(H-pad*2-10) ]);
  const line=smoothPath(pts);
  const area=line+` L${W},${H} L0,${H} Z`;
  const last=pts[pts.length-1];
  return `<svg class="pulse__spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <defs><linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E7C079" stop-opacity=".42"/><stop offset="1" stop-color="#E7C079" stop-opacity="0"/></linearGradient></defs>
    <path class="spark-area" d="${area}" fill="url(#heroGrad)"/>
    <path class="spark-line" d="${line}" fill="none" stroke="#F0DBA6" stroke-width="2.8" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="spark-dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4" fill="#F8EFD0"/>
  </svg>`;
}
function donut(segs, center){
  const tot=segs.reduce((s,x)=>s+x.v,0)||1;
  const size=138, sw=20, r=(size-sw)/2, c=2*Math.PI*r, cx=size/2;
  let off=0;
  const arcs=segs.map(s=>{
    const len=s.v/tot*c;
    const el=`<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${sw}" stroke-dasharray="${(len-2).toFixed(2)} ${(c-len+2).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cx})"/>`;
    off+=len; return el;
  }).join('');
  return `<svg class="donut" viewBox="0 0 ${size} ${size}">
    <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="var(--canvas-2)" stroke-width="${sw}"/>
    ${arcs}
    <text class="donut__num" data-count="${center}" x="${cx}" y="${cx-2}" text-anchor="middle" font-family="'DM Serif Display', Georgia, serif" font-size="34" font-weight="400" letter-spacing="-1" fill="var(--ink)">0</text>
    <text x="${cx}" y="${cx+17}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="500" fill="var(--ink-3)">müraciət</text>
  </svg>`;
}

function viewAnalytics(){
  const all = scopedReports();
  const total = all.length;
  const resolved = all.filter(r=>r.status==='resolved').length;
  const open = all.filter(r=>!['resolved','rejected'].includes(r.status)).length;

  /* stat cards */
  const dpill=(dir,txt)=>`<span class="pilld ${dir==='up'?'delta-up':'delta-down'}">${dir==='up'?I.up:I.down}${txt}</span>`;
  const stat=(icon,lab,fig,unit,delta)=>`<div class="stat">
    <div class="stat__top"><span class="stat__ic">${icon}</span><span class="stat__lab">${lab}</span></div>
    <div class="stat__fig"><span data-count="${fig}">0</span>${unit?`<small>${unit}</small>`:''}</div>
    <div class="stat__delta">${delta}<span class="lbl">keçən həftəyə</span></div></div>`;
  const stats=`<div class="statgrid">
    ${stat(I.inbox,'Ümumi müraciət',total,'',dpill('up','12.5%'))}
    ${stat(I.check,'Həll edilmiş',resolved,'',dpill('up','18.3%'))}
    ${stat(I.clock,'Orta həll vaxtı','19','saat',dpill('down','4 saat'))}
    ${stat(I.analytics,'SLA uyğunluğu','87','%',dpill('up','3.2%'))}
  </div>`;

  /* trend area chart */
  const trend=[14,19,16,23,21,28,24,31,27];
  const days=['22','23','24','25','26','27','28','29','30'];
  const trendCard=`<div class="chartcard">
    <div class="chartcard__head">
      <div><div class="chartcard__t">Müraciət Trendi</div><div class="chartcard__big"><span data-count="${trend.reduce((a,b)=>a+b,0)}">0</span> <span style="font-size:14px;font-weight:600;color:var(--ink-3)">son 9 gün</span></div></div>
      <div class="chartcard__legend"><span class="clg"><span class="clg__sw" style="background:var(--teal)"></span>Gündəlik müraciət</span></div>
    </div>
    ${areaChart(trend,'#0F5057')}
    <div class="axis-x">${days.map(d=>`<span>${d} May</span>`).join('')}</div>
  </div>`;

  /* status distribution donut */
  const stColor={pending:'#9A7B12',approved:'#1E6B7A',progress:'#2A66B8',proof:'#7A4DB0',resolved:'#2E9266',rejected:'#9B9387'};
  const stOrder=['pending','approved','progress','proof','resolved','rejected'];
  const segs=stOrder.map(s=>({s,v:all.filter(r=>r.status===s).length})).filter(x=>x.v).map(x=>({...x,color:stColor[x.s]}));
  const legend=segs.map(x=>`<div class="dleg"><span class="dleg__sw" style="background:${x.color}"></span><span class="dleg__n">${ST[x.s].name}</span><span class="dleg__v">${x.v}</span></div>`).join('');
  const statusCard=`<div class="chartcard">
    <div class="chartcard__head"><div class="chartcard__t">Status Paylanması</div></div>
    <div class="donut-wrap">${donut(segs,total)}<div class="donut-legend">${legend}</div></div>
  </div>`;

  return `${stats}
    <div class="grid-2" style="align-items:stretch">${trendCard}${statusCard}</div>`;
}

/* ============================================================
   VIEW · REPORTS / EXPORT
   ============================================================ */
function viewReports(){
  const rows = scopedReports();
  const total = rows.length;
  const resolved = rows.filter(r=>r.status==='resolved').length;
  const open = rows.filter(r=>!['resolved','rejected'].includes(r.status)).length;

  const stat=(icon,lab,fig)=>`<div class="stat">
    <div class="stat__top"><span class="stat__ic">${icon}</span><span class="stat__lab">${lab}</span></div>
    <div class="stat__fig"><span data-count="${fig}">0</span></div></div>`;
  const summary=`<div class="statgrid" style="grid-template-columns:repeat(3,1fr)">
    ${stat(I.inbox,'Ümumi müraciət',total)}
    ${stat(I.check,'Həll edilmiş',resolved)}
    ${stat(I.layers,'Açıq müraciət',open)}
  </div>`;

  const expOpt=(fmt,icon,title,sub)=>`<button class="expopt" data-export="${fmt}">
    <span class="expopt__ic">${icon}</span>
    <span class="expopt__body"><span class="expopt__t">${title}</span><span class="expopt__s">${sub}</span></span>
    ${I.download}
  </button>`;
  const exportCard=`<div class="card">
    <div class="card__head"><span class="card__title">Hesabat ixracı</span><span class="card__sub">${total} müraciət</span></div>
    <div class="card__body card__body--pad">
      <div class="fieldlab">Tarix aralığı</div>
      <div class="segment" style="width:fit-content;margin-bottom:20px">
        <button class="segbtn is-active">Bu həftə</button>
        <button class="segbtn">Bu ay</button>
        <button class="segbtn">Özəl interval</button>
      </div>
      <div class="fieldlab">İxrac formatı</div>
      <div class="expgrid">
        ${expOpt('csv', I.reports, 'Excel cədvəli', 'CSV · filtrlər tətbiq olunur')}
        ${expOpt('pdf', I.reports, 'PDF sənədi', 'Çap üçün hazır')}
      </div>
    </div>
  </div>`;

  const previewCard=`<div class="card"><div class="card__head"><span class="card__title">Önizləmə</span><span class="card__sub">${total} sətir</span></div>
    <div class="card__body" style="max-height:440px;overflow:auto;padding:0">
      <table class="table"><thead><tr><th style="padding-left:18px">İD</th><th>Müraciət</th><th>Status</th><th>Prioritet</th></tr></thead><tbody>
      ${rows.map(r=>`<tr data-open="${r.id}"><td class="tcell-id" style="padding-left:18px">#${r.id}</td><td class="tcell-title" style="max-width:200px">${esc(r.title)}</td><td>${statusTag(r)}</td><td><b style="font-weight:600">${r.score}</b></td></tr>`).join('')}
      </tbody></table>
    </div>
  </div>`;

  return `${summary}<div class="grid-2" style="align-items:start;grid-template-columns:1fr 1.3fr">${exportCard}${previewCard}</div>`;
}

/* ============================================================
   VIEW · SETTINGS
   ============================================================ */
function viewSettings(){
  const role=ROLES[state.role];
  const toggle=(l,sub,on)=>`<div class="riskrow" style="border-color:var(--hair);cursor:default">
    <div class="riskrow__body"><div class="riskrow__title">${l}</div><div class="riskrow__sub" style="font-family:var(--sans)">${sub}</div></div>
    <div style="width:42px;height:24px;border-radius:20px;background:${on?'var(--teal)':'var(--hair)'};position:relative;flex:none"><span style="position:absolute;top:3px;${on?'right:3px':'left:3px'};width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:var(--shadow-sm)"></span></div>
  </div>`;
  return `<div class="grid-2" style="align-items:start">
    <div class="card"><div class="card__head"><span class="card__title">Profil</span></div><div class="card__body card__body--pad">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
        <span class="rolecard__avatar" style="width:54px;height:54px;font-size:18px">${role.init}</span>
        <div><div style="font-family:var(--display);font-weight:700;font-size:17px">${role.name}</div><div class="muted">${role.title}${role.dept?' · '+role.dept:''}</div></div>
      </div>
      <div class="aibox"><div class="aibox__lbl">Səlahiyyət səviyyəsi</div><div class="aibox__val" style="font-size:15px">${role.can.allDept?'Tam giriş (Rayon)':role.can.approve?'Departament':'Sahə işçisi'}</div></div>
    </div></div>
    <div class="card"><div class="card__head"><span class="card__title">Bildiriş Tənzimləmələri</span></div><div class="card__body card__body--pad"><div class="risk">
      ${toggle('Gecikmiş müraciət xəbərdarlığı','Push · SMS · E-poçt',true)}
      ${toggle('Yeni təyinat bildirişi','Sizə iş təyin olunduqda',true)}
      ${toggle('Həftəlik hesabat','Bazar ertəsi səhər avtomatik',false)}
      ${toggle('Sübut təsdiqi gözləyir','Təsdiq tələb olunduqda',true)}
    </div></div></div>
  </div>`;
}

/* ============================================================
   VIEW · FEEDBACK  (Vətəndaş rəyləri — /feedbacks, yalnız oxu)
   ============================================================ */
let FEEDBACK = [];
let feedbackFilter = 'all';

/* Realtime DB feedback record → view model (integration brief §4). */
function mapFeedback(key, d){
  d = d || {};
  const created = toDate(d.createdAt ?? d.createdAtISO, new Date());
  return {
    key: String(key),
    rating: Math.max(0, Math.min(5, Math.round(Number(d.rating)||0))),
    comment: (d.comment||'').trim(),
    reportId: (d.reportId!=null ? String(d.reportId) : '').trim(),
    category: (d.category||'').trim(),
    reporter: (d.reporter||'').trim() || 'Anonim',
    created,
    createdMs: Number(d.createdAt) || created.getTime(),
  };
}

/* shown only while the live /feedbacks node is empty (mirrors DEMO_SEED for reports) */
const DEMO_FEEDBACK = [
  {rating:5, comment:'Çox sürətli həll oldu, təşəkkür edirəm! Çuxur bir gün ərzində düzəldildi.', reportId:'1', category:'Yollar və Asfalt', reporter:'Emin Bağırov', createdAt:+NOW-2*HOUR},
  {rating:4, comment:'Yaxşı işləyir, amma cavab bir az gec gəldi.', reportId:'4', category:'Küçə İşıqlandırması', reporter:'Leyla Məmmədova', createdAt:+NOW-9*HOUR},
  {rating:5, comment:'', reportId:'6', category:'Təmizlik və Tullantılar', reporter:'Anonim', createdAt:+NOW-27*HOUR},
  {rating:2, comment:'Problem hələ tam həll olunmayıb, yenidən baxılmasını xahiş edirəm.', reportId:'12', category:'Su və Subasma', reporter:'Rəşad Quliyev', createdAt:+NOW-2*24*HOUR},
  {rating:3, comment:'Orta səviyyədə. Gözlədiyimdən bir az uzun çəkdi.', reportId:'', category:'', reporter:'Nigar Əliyeva', createdAt:+NOW-3*24*HOUR},
  {rating:5, comment:'Mükəmməl xidmət, parkdakı skamyalar təmir olundu.', reportId:'11', category:'Parklar və Avadanlıq', reporter:'Tural Hüseynov', createdAt:+NOW-4*24*HOUR},
].map((d,i)=>mapFeedback(String(i+1), d));

function feedbackData(){ return FEEDBACK.length ? FEEDBACK : DEMO_FEEDBACK; }

/* 1–5 stars; filled = amber #F59E0B (matches mobile app), empty = light gray */
function fbStars(rating, px){
  let h='';
  for(let i=1;i<=5;i++) h+=`<span class="star${i<=rating?' is-on':''}">★</span>`;
  return `<span class="stars" style="font-size:${px||14}px">${h}</span>`;
}

function viewFeedback(){
  const all = feedbackData();
  if(!all.length){
    return `<div class="empty" style="padding:100px">${I.star}<h4>Hələ rəy yoxdur</h4><p>Vətəndaşlar müraciətləri qiymətləndirdikcə rəylər burada canlı görünəcək.</p></div>`;
  }
  const total = all.length;
  const sum = all.reduce((s,f)=>s+f.rating,0);
  const avg = sum/total;
  const pctPos = Math.round(all.filter(f=>f.rating>=4).length/total*100);

  /* stat cards */
  const stat=(icon,lab,fig,unit)=>`<div class="stat">
    <div class="stat__top"><span class="stat__ic">${icon}</span><span class="stat__lab">${lab}</span></div>
    <div class="stat__fig">${fig}${unit?`<small>${unit}</small>`:''}</div></div>`;
  const stats=`<div class="statgrid" style="grid-template-columns:repeat(3,1fr)">
    ${stat(I.star,'Orta qiymət',avg.toFixed(1),'/ 5')}
    ${stat(I.inbox,'Ümumi rəy',total)}
    ${stat(I.check,'Müsbət rəy',pctPos,'%')}
  </div>`;

  /* big score card */
  const scoreCard=`<div class="card"><div class="card__body card__body--pad fbscore">
    <div class="fbscore__num" data-count="${avg.toFixed(1)}" data-dec="1">0.0</div>
    ${fbStars(Math.round(avg),22)}
    <div class="muted" style="font-size:13px">${total} vətəndaş rəyi əsasında</div>
  </div></div>`;

  /* 5 → 1 distribution */
  const counts={1:0,2:0,3:0,4:0,5:0};
  all.forEach(f=>{ if(counts[f.rating]!=null) counts[f.rating]++; });
  const dist=[5,4,3,2,1].map(s=>{
    const n=counts[s], pct=Math.round(n/total*100);
    return `<div class="bdrow"><div class="bdrow__top"><span class="bdrow__name">${fbStars(s,12)}</span><span class="bdrow__val">${n} · ${pct}%</span></div><div class="bdrow__track"><div class="bdrow__fill" style="width:${pct}%;background:#F59E0B"></div></div></div>`;
  }).join('');
  const distCard=`<div class="card"><div class="card__head"><span class="card__title">Qiymət paylanması</span><span class="card__sub">${total} rəy</span></div><div class="bd">${dist}</div></div>`;

  /* rating filter + list */
  const chips=['all','5','4','3','2','1'].map(v=>{
    const lbl = v==='all' ? 'Hamısı' : v+'★';
    return `<button class="segbtn ${feedbackFilter===v?'is-active':''}" data-frate="${v}">${lbl}</button>`;
  }).join('');
  const rows = feedbackFilter==='all' ? all : all.filter(f=>f.rating===Number(feedbackFilter));
  const list = rows.length ? rows.map(fbCard).join('')
    : `<div class="empty" style="grid-column:1/-1">${I.inbox}<h4>Bu qiymətdə rəy yoxdur</h4><p>Başqa filtr seçin.</p></div>`;

  return `${stats}
    <div class="grid-2" style="align-items:stretch;grid-template-columns:1fr 1.5fr;margin-bottom:18px">${scoreCard}${distCard}</div>
    <div class="toolbar" style="margin-bottom:14px"><div class="segment">${chips}</div><div class="toolbar__spacer"></div><span class="toolbar__count"><b>${rows.length}</b> rəy göstərilir</span></div>
    <div class="fblist">${list}</div>`;
}

function fbCard(f){
  const comment = f.comment
    ? `<p class="fbcard__text">${esc(f.comment)}</p>`
    : `<p class="fbcard__text fbcard__text--empty">Şərh yoxdur</p>`;
  const cat = f.category ? `<span class="pill fbcard__cat">${esc(f.category)}</span>` : '';
  /* data-open lets the global handler jump to the related /reports detail when present */
  const rep = f.reportId ? `<span class="fbcard__rep" data-open="${esc(f.reportId)}">Müraciət #${esc(f.reportId)} →</span>` : '';
  return `<div class="fbcard">
    <div class="fbcard__head">${fbStars(f.rating,15)}<span class="fbcard__date">${ageStr(f.created)}</span></div>
    ${comment}
    <div class="fbcard__foot">
      <span class="fbcard__author"><span class="miniav" style="width:24px;height:24px;font-size:9px;background:linear-gradient(145deg,#9aa0ad,#697080)">${esc(initials(f.reporter))}</span>${esc(f.reporter)}</span>
      <span class="fbcard__meta">${cat}${rep}</span>
    </div>
  </div>`;
}

/* ============================================================
   DETAIL PANEL
   ============================================================ */
function openDetail(id){
  const r = REPORTS.find(x=>String(x.id)===String(id));
  if(!r) return;
  state.sel = r;
  if(state.view!=='detail') state.detailReturn = state.view;
  state.fix={url:null,file:null,verdict:null,verifying:false,error:null,manual:false};
  state.proof={before:null,after:null};
  state.view='detail';
  $('#roleMenu').hidden=true;
  render();
}
function closeDetail(){
  state.view = state.detailReturn || (state.role==='worker'?'tasks':'overview');
  state.sel=null;
  render();
}
function genTimeline(r){
  const steps=[];
  const t0=r.created;
  steps.push({label:'Vətəndaş müraciəti qeydə alındı', meta:fmtDate(t0)+' · CivicWave mobil', done:true});
  steps.push({label:'AI təhlili — '+(CAT[r.cat]||CAT.other).name+' təyin edildi', meta:'Etibarlılıq '+r.conf+'%'+(r.cost?' · '+azn(r.cost):''), done:true});
  const step=ST[r.status].step;
  if(r.status==='rejected'){ steps.push({label:'Müraciət rədd edildi', meta:'Təsdiq mərhələsi · spam', current:true}); return steps; }
  steps.push({label:'Departament rəhbəri təsdiqlədi', meta:fmtDate(new Date(+t0+2*HOUR)), done:step>=1, current:step===0});
  if(step>=1) steps.push({label:'Təyin edildi → '+(r.worker||'gözləyir'), meta:r.dept, done:step>=2, current:step===1});
  if(step>=2) steps.push({label:'İş icraya başladı', meta:fmtDate(new Date(+t0+6*HOUR)), done:step>=3, current:step===2});
  if(step>=3) steps.push({label:'Həll sübutu yükləndi', meta:'Əvvəl/sonra foto · təsdiq gözləyir', done:step>=4, current:step===3});
  if(step>=4) steps.push({label:'Müraciət həll edildi — bağlandı', meta:'Vətəndaşa bildiriş göndərildi · xallar təsdiqləndi', done:true, current:true});
  return steps;
}
const ic = s => `<span class="ic">${s}</span>`;

/* ---- full-page detail ---- */
function viewDetail(){
  const r=state.sel;
  if(!r) return `<div class="empty">${I.inbox}<h4>Müraciət tapılmadı</h4><p>Bu müraciət silinib və ya mövcud deyil.</p></div>`;
  const tl = genTimeline(r).map(s=>`<div class="tl ${s.done?'is-done':''} ${s.current?'is-current':''}"><span class="tl__dot"></span><div class="tl__label">${s.label}</div><div class="tl__meta">${s.meta}</div></div>`).join('');
  const resPhoto = r.fixedImageUrl || r.proofAfter;
  const baGallery = resPhoto ? `<div class="dblock"><div class="dblock__h">${ic(I.check)} Həll Sübutu — əvvəl / sonra</div>
    <div class="ba"><figure><div class="ba__img">${r.proofBefore?`<img src="${r.proofBefore}">`:photo(r,'main')}</div><figcaption>Əvvəl · problem</figcaption></figure>
    <figure><div class="ba__img"><img src="${esc(resPhoto)}"></div><figcaption>Sonra · həll edildi${r.resolvedBy?` · ${esc(r.resolvedBy.split(' ')[0])}`:''}</figcaption></figure></div></div>` : '';

  return `<div class="dp">
    <div class="dp__bar">
      <button class="btn btn--ghost btn--sm" data-close>${ic(I.arrowL)} Geri</button>
      <span class="detail__id">#${r.id}</span>
      <span class="mono muted" style="font-size:12px">${fmtDate(r.created)}</span>
      <div style="flex:1"></div>
      ${sevTag(r)} ${statusTag(r)} ${r.reopened?`<span class="pill" style="color:var(--st-proof);background:#F1EAF8">↻ Təkrar açılıb</span>`:''}
    </div>
    <h1 class="dp__title">${esc(r.title)}</h1>
    <div class="dp__grid">
      <div class="dp__main">
        <div class="dblock"><div class="dblock__h">${ic(I.eye)} Vətəndaşın yüklədiyi foto</div><div class="dp-photo">${photo(r,'main')}</div></div>

        <div class="dblock"><div class="dblock__h">${ic(I.bolt)} Süni İntellekt Təhlili</div>
          <div class="ai-explain"><span class="ai-explain__ic">${I.spark}</span><div><div class="ai-explain__h">AI şəkil təhlili — nə aşkarlandı</div><p>${esc(r.aiExplanation)}</p></div></div>
          <div class="aigrid">
            <div class="aibox"><div class="aibox__lbl">Kateqoriya</div><div class="aibox__val" style="font-size:15px;display:flex;align-items:center;gap:8px">${catIcon(r)}${(CAT[r.cat]||CAT.other).name}</div></div>
            <div class="aibox"><div class="aibox__lbl">Təxmini xərc</div><div class="aibox__val">${costStr(r)}</div></div>
            <div class="aibox"><div class="aibox__lbl">Ciddilik</div><div class="aibox__val" style="font-size:15px;color:var(${SEV[r.sev].cls.replace('sev--','--sev-')})">${SEV[r.sev].name}</div></div>
            <div class="aibox"><div class="aiconf"><div class="aiconf__ring">${ring(r.conf,46,4,r.conf>85?'var(--sev-low)':'var(--sev-mid)')}</div><div><div class="aibox__lbl">Etibarlılıq</div><div class="aibox__val">${r.conf}%</div></div></div></div>
          </div>
        </div>

        ${baGallery}

        <div class="dblock"><div class="dblock__h">Vətəndaş qeydi</div>
          <div class="note">${r.note?esc(r.note):'<span class="muted">Vətəndaş əlavə qeyd yazmayıb.</span>'}<div class="note__author"><span class="miniav" style="width:22px;height:22px;font-size:9px;background:linear-gradient(145deg,#9aa0ad,#697080)">${r.reporter?esc(initials(r.reporter)):'V'}</span>${r.reporter?esc(r.reporter):'Anonim vətəndaş'} · ${ageStr(r.created)}</div></div>
        </div>

        <div class="dblock"><div class="dblock__h">${ic(I.pin)} Yer</div>
          <div class="locrow"><div class="locmap" id="miniMap"></div><div class="locmeta"><div class="locmeta__addr">${esc(r.addr)}</div><div class="locmeta__coord">${ic(I.pin)}${r.lat.toFixed(4)}, ${r.lng.toFixed(4)}</div><div class="mono" style="font-size:11px;color:var(--ink-4)">Nərimanov rayonu, Bakı</div></div></div>
        </div>

        <div class="dblock"><div class="dblock__h">${ic(I.clock)} Hadisələr Xronologiyası</div><div class="timeline">${tl}</div></div>
      </div>

      <aside class="dp__side" id="dpSide">${sidePanel(r)}</aside>
    </div>
  </div>`;
}

function reassignBtnHTML(){ return `<button class="btn btn--ghost btn--block" data-act="reassign">${ic(I.reassign)} Yenidən təyin et</button>`; }

function closeCard(r){
  const fb=!!(window.CIVIC_FB&&window.CIVIC_FB.enabled);
  const geminiOn=!!(window.CivicGemini&&window.CivicGemini.enabled);
  const fx=state.fix;
  let verdictHTML='';
  if(fx.verifying){
    verdictHTML=`<div class="verdict verdict--wait"><span class="verdict__ic spin">${I.spark}</span><div><div class="verdict__h">AI şəkli analiz edir…</div><div class="verdict__sub">Gemini təmiri qiymətləndirir</div></div></div>`;
  }else if(fx.error){
    verdictHTML=`<div class="verdict verdict--err"><span class="verdict__ic">${I.x}</span><div><div class="verdict__h">AI yoxlaması alınmadı</div><div class="verdict__sub">${esc(fx.error)}</div></div></div>`;
  }else if(fx.verdict){
    const ok=fx.verdict.approved;
    verdictHTML=`<div class="verdict ${ok?'verdict--ok':'verdict--no'}"><span class="verdict__ic">${ok?I.check:I.x}</span><div><div class="verdict__h">${ok?'AI təsdiqlədi — təmir uğurlu':'AI: təmir kifayət deyil'} · ${fx.verdict.confidence}%</div><div class="verdict__sub">${esc(fx.verdict.reason||'')}</div></div></div>`;
  }
  const canClose=(fx.verdict&&fx.verdict.approved)||fx.manual;
  const verifyBtn=(fx.url&&geminiOn&&!fx.verifying)?`<button class="btn btn--primary btn--block" data-act="verifyFix">${ic(I.spark)} ${fx.verdict?'Yenidən yoxla':'AI ilə yoxla'}</button>`:'';
  const override=(fx.url&&!canClose&&!fx.verifying)?`<button class="linkbtn" data-act="overrideFix">${geminiOn?'AI olmadan əl ilə təsdiqlə':'Əl ilə təsdiqlə'} →</button>`:'';
  return `<div class="dpcard">
    <div class="dpcard__h">${ic(I.upload)} Həll et və işi bağla</div>
    <p class="dpcard__p">İş bitdikdə <b>düzəldilmiş yerin fotosunu</b> yükləyin. ${geminiOn?'AI fotonu yoxlayır; təsdiqləndikdə':'Foto əlavə edildikdə'} iş bağlanır.${fb?'':' (Demo)'}</p>
    <label class="dropzone ${fx.url?'is-filled':''}" data-drop="fix" style="aspect-ratio:16/10;margin-bottom:10px">
      ${fx.url?`<span class="dropzone__tag">SONRA · HƏLL</span><img src="${fx.url}">`:`<span class="dropzone__tag">SONRA · HƏLL</span>${I.upload}<span class="dropzone__lbl">Həll fotosunu seç</span>`}
      <input type="file" accept="image/*" hidden data-fixfile>
    </label>
    ${verdictHTML}
    <div class="dpbtns" style="margin-top:10px">${verifyBtn}<button class="btn btn--accent btn--block" data-act="closeCase" ${canClose?'':'disabled'}>${ic(I.check)} İşi Bağla</button></div>
    ${override?`<div style="text-align:center;margin-top:8px">${override}</div>`:''}
  </div>`;
}

function proofCard(r){
  const p=state.proof;
  return `<div class="dpcard"><div class="dpcard__h">${ic(I.upload)} Həll sübutu yüklə</div>
    <p class="dpcard__p">İşin əvvəl/sonra fotolarını əlavə edin — rəhbər təsdiqinə göndərilir.</p>
    <div class="proofgrid">
      <label class="dropzone ${p.before?'is-filled':''}" data-drop="before">${p.before?`<span class="dropzone__tag">ƏVVƏL</span><img src="${p.before}">`:`<span class="dropzone__tag">ƏVVƏL</span>${I.upload}<span class="dropzone__lbl">Foto</span>`}<input type="file" accept="image/*" hidden data-file="before"></label>
      <label class="dropzone ${p.after?'is-filled':''}" data-drop="after">${p.after?`<span class="dropzone__tag">SONRA</span><img src="${p.after}">`:`<span class="dropzone__tag">SONRA</span>${I.upload}<span class="dropzone__lbl">Foto</span>`}<input type="file" accept="image/*" hidden data-file="after"></label>
    </div>
    <button class="btn btn--primary btn--block" data-act="submitProof" style="margin-top:10px" ${(p.before&&p.after)?'':'disabled'}>${ic(I.check)} Sübutu göndər</button>
  </div>`;
}

function sidePanel(r){
  const can=ROLES[state.role].can, d=deadlineStr(r);
  let act='';
  if(r.status==='pending' && can.approve){
    act=`<div class="dpcard"><div class="dpcard__h">${ic(I.check)} Təsdiq tələb olunur</div>
      <p class="dpcard__p">Müraciəti təsdiqləyin (vətəndaşa xal verilir) və ya spam kimi rədd edin.</p>
      <div class="dpbtns"><button class="btn btn--primary btn--block" data-act="approve">${ic(I.check)} Təsdiqlə</button>
      <button class="btn btn--danger btn--block" data-act="reject">${ic(I.x)} Rədd et</button>${can.reassign?reassignBtnHTML():''}</div></div>`;
  } else if(['approved','progress'].includes(r.status) && can.close){
    act=closeCard(r)+(can.reassign?`<div class="dpcard"><div class="dpbtns">${reassignBtnHTML()}</div></div>`:'');
  } else if(['approved','progress'].includes(r.status) && can.uploadProof && r.worker===ROLES[state.role].name){
    act=proofCard(r);
  } else if(r.status==='proof' && can.proof){
    act=`<div class="dpcard"><div class="dpcard__h">${ic(I.check)} Sübut təsdiqi</div>
      <p class="dpcard__p">Sahə işçisinin yüklədiyi həll sübutunu yoxlayın.</p>
      <div class="dpbtns"><button class="btn btn--primary btn--block" data-act="approveProof">${ic(I.check)} Təsdiqlə & bağla</button>
      <button class="btn btn--danger btn--block" data-act="rejectProof">${ic(I.reassign)} Geri qaytar</button></div></div>`;
  } else if(r.status==='proof' && can.uploadProof){
    act=`<div class="dpcard"><div class="dphint">${ic(I.clock)} Rəhbər təsdiqini gözləyir</div></div>`;
  } else if(r.status==='resolved'){
    act=`<div class="dpcard"><div class="dphint dphint--ok">${ic(I.check)} Həll edilib və bağlanıb${r.resolvedBy?` · ${esc(r.resolvedBy)}`:''}</div></div>`;
  } else if(r.status==='rejected'){
    act=`<div class="dpcard"><div class="dphint dphint--no">${ic(I.x)} Müraciət rədd edilib</div></div>`;
  } else {
    act=`<div class="dpcard"><div class="dphint">${ic(I.eye)} Bu rolda əməliyyat yoxdur</div></div>`;
  }
  const facts=`<div class="dpcard"><div class="dpcard__h">Məlumat</div>
    <div class="factrow"><span>Departament</span><b>${esc(r.dept)}</b></div>
    <div class="factrow"><span>Təyinat</span><b>${r.worker?esc(r.worker):'<span class="muted">təyin olunmayıb</span>'}</b></div>
    <div class="factrow"><span>Prioritet xalı</span><b class="mono">${r.score}/100</b></div>
    <div class="factrow"><span>Son tarix</span><b class="mono" style="color:${d.over?'var(--vermilion)':'inherit'}">${d.text} ${d.over?'gecikib':'qalıb'}</b></div>
    <div class="factrow"><span>AI etibarlılıq</span><b class="mono">${r.conf}%</b></div>
  </div>`;
  return act+facts;
}
function refreshSide(){ const el=$('#dpSide'); if(el && state.sel) el.innerHTML=sidePanel(state.sel); }
function initMiniMap(){
  const el=$('#miniMap'); if(!el || !state.sel || typeof L==='undefined') return;
  const r=state.sel;
  const mm=L.map(el,{zoomControl:false,attributionControl:false,dragging:false,scrollWheelZoom:false,doubleClickZoom:false}).setView([r.lat,r.lng],15);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{subdomains:'abcd'}).addTo(mm);
  const sz=24;
  L.marker([r.lat,r.lng],{icon:L.divIcon({className:'',html:`<div class="mappin" style="width:${sz}px;height:${sz}px;background:${SEVHEX[r.sev]}"></div>`,iconSize:[sz,sz],iconAnchor:[sz/2,sz]})}).addTo(mm);
}

/* ============================================================
   ACTIONS
   ============================================================ */
function fbEnabled(){ return !!(window.CIVIC_FB && window.CIVIC_FB.enabled); }
function fbPatch(r, obj){ if(fbEnabled() && r && r.docId) window.CIVIC_FB.patch(r.docId, obj).catch(e=>toast('DB yazma xətası: '+(e.message||e),'warn')); }
/* /status flag for the MOBILE app: 1 = müraciət təsdiqlənib (approved and beyond),
   0 = hələ təsdiq gözləyir və ya rədd edilib. */
function approvedFlag(st){ return ['approved','progress','proof','resolved'].includes(st) ? 1 : 0; }
function setStatus(r, st, msg, kind='ok'){
  r.status=st; toast(msg,kind);
  // Realtime DB: numeric /status (1|0) for mobile + /statusText for the dashboard lifecycle
  fbPatch(r, { status: approvedFlag(st), statusText: ST_DB[st]||st });
  render();
}
function handleAction(act){
  const r=state.sel; if(!r) return;
  switch(act){
    case 'approve': setStatus(r,'approved',`#${r.id} təsdiqləndi · vətəndaşa xal verildi`); break;
    case 'reject': setStatus(r,'rejected',`#${r.id} rədd edildi`,'warn'); break;
    case 'reassign': pickDept(r); break;
    case 'approveProof': setStatus(r,'resolved',`#${r.id} həll edildi və bağlandı ✓`); break;
    case 'rejectProof': setStatus(r,'progress',`#${r.id} sübutu geri qaytarıldı`,'warn'); break;
    case 'submitProof':
      r.proofBefore=state.proof.before; r.proofAfter=state.proof.after;
      setStatus(r,'proof',`#${r.id} sübutu göndərildi · rəhbər təsdiqini gözləyir`,'info'); break;
    case 'verifyFix': verifyFix(); break;
    case 'overrideFix': state.fix.manual=true; toast('Əl ilə təsdiq aktiv edildi','info'); refreshSide(); break;
    case 'closeCase': closeCase(); break;
  }
}

/* AI-validate the manager's fixed photo against the original problem */
async function verifyFix(){
  const r=state.sel, fx=state.fix;
  if(!fx.url) return;
  if(!(window.CivicGemini && window.CivicGemini.enabled)){ toast('Gemini açarı yoxdur — əl ilə təsdiqləyin','warn'); return; }
  fx.verifying=true; fx.error=null; fx.verdict=null; refreshSide();
  try{
    const base64 = String(fx.url).split(',')[1] || '';
    const mime = (fx.file && fx.file.type) || (String(fx.url).slice(5).split(';')[0]) || 'image/jpeg';
    const v = await window.CivicGemini.verifyFix(
      {...r, catName:(CAT[r.cat]||CAT.other).name, sevName:SEV[r.sev].name}, base64, mime);
    fx.verifying=false; fx.verdict=v;
    toast(v.approved?`AI təsdiqlədi · ${v.confidence}%`:`AI: təmir kifayət deyil · ${v.confidence}%`, v.approved?'ok':'warn');
  }catch(e){
    fx.verifying=false; fx.error=(e&&e.message)||String(e);
    toast('AI yoxlaması alınmadı','warn');
  }
  refreshSide();
}

/* Manager/Head: upload the "fixed" photo → Firebase Storage, write URL+status to
   Firestore, then close. Falls back to local-only when Firebase is not configured. */
async function closeCase(){
  const r=state.sel, f=state.fix;
  if(!r || !f.url){ return; }
  const by = ROLES[state.role].name;
  if(fbEnabled() && r.docId){
    const btn=$('[data-act="closeCase"]');
    if(btn){ btn.innerHTML=`${I.spark} <span>Yüklənir…</span>`; btn.classList.add('is-busy'); btn.style.pointerEvents='none'; }
    toast('Firebase Storage-a yüklənir…','info');
    try{
      const url = await window.CIVIC_FB.closeWithPhoto(r.docId, f.file || f.url, by, f.verdict||null);
      r.fixedImageUrl = url;            // onValue will also confirm this
    }catch(e){
      toast('Yükləmə xətası: '+(e.message||e),'warn');
      refreshSide(); return;
    }
  }else{
    r.fixedImageUrl = f.url;            // local/demo: keep the data-URL preview
  }
  r.status='resolved'; r.resolvedBy=by; r.fixVerdict=f.verdict||null;
  state.fix={url:null,file:null,verdict:null,verifying:false,error:null,manual:false};
  toast(`#${r.id} həll fotosu ilə bağlandı ✓`,'ok');
  render();
}
function pickDept(r){
  const can=ROLES[state.role].can.reassign;
  const opts = can==='dept' ? [ROLES[state.role].dept] : DEPTS;
  const pop=document.createElement('div');
  pop.className='scrim'; pop.style.zIndex=300; pop.style.display='grid'; pop.style.placeItems='center';
  pop.innerHTML=`<div class="card" style="width:360px;padding:6px;box-shadow:var(--shadow-lg)" onclick="event.stopPropagation()">
    <div class="rolemenu__head" style="padding:12px 12px 8px">Departamentə yenidən təyin et</div>
    ${opts.map(dp=>`<button class="roleopt" data-pickdept="${esc(dp)}"><span class="roleopt__av" style="background:linear-gradient(145deg,#3a7a80,#0F5057)">${initials(dp)}</span><span class="roleopt__meta"><span class="roleopt__name">${esc(dp)}</span></span></button>`).join('')}
  </div>`;
  pop.addEventListener('click',()=>pop.remove());
  pop.querySelectorAll('[data-pickdept]').forEach(b=>b.addEventListener('click',()=>{
    const dep=b.dataset.pickdept; r.dept=dep;
    fbPatch(r, {department:dep});
    pop.remove(); toast(`#${r.id} → ${dep}`,'info'); render();
  }));
  document.body.appendChild(pop);
}

/* ---------- export ---------- */
function exportCSV(){
  const rows=filtered().length?filtered():scopedReports();
  const head=['ID','Başlıq','Kateqoriya','Ciddilik','Status','Departament','Təyinat','Prioritet','Etibarlılıq','Xərc','Ünvan','Son tarix'];
  const lines=[head.join(',')].concat(rows.map(r=>[
    r.id,`"${r.title}"`,CAT[r.cat].name,SEV[r.sev].name,ST[r.status].name,r.dept,r.worker||'-',r.score,r.conf+'%',r.cost,`"${r.addr}"`,fmtDate(r.deadline)
  ].join(',')));
  const blob=new Blob(['﻿'+lines.join('\n')],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='civicwave-hesabat.csv'; a.click();
  toast(`${rows.length} sətir CSV ixrac olundu`,'ok');
}

/* ============================================================
   TOASTS
   ============================================================ */
function toast(msg, kind='ok'){
  const ic = kind==='ok'?I.check:kind==='warn'?I.x:I.bolt;
  const el=document.createElement('div');
  el.className=`toast toast--${kind}`;
  el.innerHTML=`<span class="toast__ic">${ic}</span><span>${msg}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(()=>{el.classList.add('out'); setTimeout(()=>el.remove(),300);},3200);
}

/* ============================================================
   EVENTS
   ============================================================ */
function go(view){ state.sel=null; state.view=view; render(); }

document.addEventListener('click', e=>{
  const t=e.target;
  const nav=t.closest('[data-nav]'); if(nav){ go(nav.dataset.nav); return; }
  const open=t.closest('[data-open]'); if(open && !t.closest('[data-proof]')){
    const fly=open.dataset.fly;
    if(fly && map){ const [la,ln]=fly.split(',').map(Number); map.flyTo([la,ln],16,{duration:.8}); }
    openDetail(open.dataset.open); return;
  }
  const proof=t.closest('[data-proof]'); if(proof){ e.stopPropagation(); openDetail(proof.dataset.proof); return; }
  if(t.closest('[data-close]')){ closeDetail(); return; }
  const act=t.closest('[data-act]'); if(act){ handleAction(act.dataset.act); return; }
  const fsev=t.closest('[data-fsev]'); if(fsev){ state.filters.sev=fsev.dataset.fsev; render(); return; }
  const frate=t.closest('[data-frate]'); if(frate){ feedbackFilter=frate.dataset.frate; render(); return; }
  const ml=t.closest('[data-maplayer]'); if(ml){ state.mapLayer=ml.dataset.maplayer; render(); return; }
  const ex=t.closest('[data-export]'); if(ex){ ex.dataset.export==='csv'?exportCSV():window.print(); return; }
  // role menu
  if(t.closest('#roleCard')){ const m=$('#roleMenu'); m.hidden=!m.hidden; return; }
  const ro=t.closest('[data-role]'); if(ro){ state.role=ro.dataset.role; state.view=ROLES[state.role].nav[0]; $('#roleMenu').hidden=true; state.filters={sev:'all',cat:'all',status:'all',dept:'all',q:''}; renderRole(); render(); toast(`${ROLES[state.role].title} kimi giriş edildi`,'info'); return; }
  if(!t.closest('#roleMenu')&&!t.closest('#roleCard')) $('#roleMenu').hidden=true;
  // sort
  const sort=t.closest('[data-sort]'); if(sort){ const k=sort.dataset.sort; if(state.sort.key===k) state.sort.dir=state.sort.dir==='asc'?'desc':'asc'; else {state.sort.key=k; state.sort.dir='desc';} render(); return; }
});

document.addEventListener('change', e=>{
  const t=e.target;
  if(t.matches('[data-fcat]')){ state.filters.cat=t.value; render(); }
  if(t.matches('[data-fstatus]')){ state.filters.status=t.value; render(); }
  if(t.matches('[data-fdept]')){ state.filters.dept=t.value; render(); }
  if(t.matches('[data-file]')){
    const slot=t.dataset.file, file=t.files[0];
    if(file){ const fr=new FileReader(); fr.onload=ev=>{ state.proof[slot]=ev.target.result; refreshSide(); }; fr.readAsDataURL(file); }
  }
  if(t.matches('[data-fixfile]')){
    const file=t.files[0];
    if(file){ const fr=new FileReader(); fr.onload=ev=>{ state.fix={url:ev.target.result, file, verdict:null, verifying:false, error:null, manual:false}; refreshSide(); }; fr.readAsDataURL(file); }
  }
});
// dropzone double-click → fill with a sample image (demo convenience)
document.addEventListener('dblclick', e=>{
  const dz=e.target.closest('[data-drop]');
  if(!dz || state.view!=='detail') return;
  const r=state.sel; if(!r) return;
  const slot=dz.dataset.drop;
  e.preventDefault();
  if(slot==='fix'){
    const svg=thumb({...r,id:r.id+'fx'});
    state.fix={url:'data:image/svg+xml;utf8,'+encodeURIComponent(svg), file:null, verdict:null, verifying:false, error:null, manual:false};
  }else{
    const svg=thumb({...r,id:r.id+(slot==='before'?'3':'77')});
    state.proof[slot]='data:image/svg+xml;utf8,'+encodeURIComponent(svg);
  }
  refreshSide();
});

// search
let searchT;
document.addEventListener('input', e=>{
  if(e.target.id==='globalSearch'){
    clearTimeout(searchT);
    searchT=setTimeout(()=>{
      state.filters.q=e.target.value.trim();
      if(state.filters.q && !['queue','map','tasks'].includes(state.view)){ state.view= state.role==='worker'?'tasks':'queue'; }
      render();
      if(state.filters.q) $('#globalSearch').focus();
    },200);
  }
});
document.addEventListener('keydown', e=>{
  if(e.key==='/' && document.activeElement.id!=='globalSearch'){ e.preventDefault(); $('#globalSearch').focus(); }
  if(e.key==='Escape'){ if(state.view==='detail') closeDetail(); $('#roleMenu').hidden=true; }
});

/* animated count-up for any [data-count] inside the freshly rendered view.
   data-dec controls decimal places (e.g. average rating). */
function animateCounts(root){
  const els = (root||document).querySelectorAll('[data-count]');
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  els.forEach(el=>{
    const to = parseFloat(el.dataset.count); if(isNaN(to)) return;
    const dec = el.dataset.dec ? +el.dataset.dec : 0;
    const fmt = v => dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
    if(reduce){ el.textContent = fmt(to); return; }
    const dur = 1000, t0 = performance.now();
    function tick(t){
      const p = Math.min(1,(t-t0)/dur);
      const e = 1 - Math.pow(1-p, 3);          // easeOutCubic
      el.textContent = fmt(to*e);
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// keep qCount synced + run entrance count-ups after each render
const _render=render;
render=function(){ _render(); const c=$('#qCount'); if(c){ const n=filtered().length; c.innerHTML=`<b>${n}</b> müraciət göstərilir`; } animateCounts($('#view')); };

/* ============================================================
   FIREBASE BRIDGE (Realtime Database)
   firebase.js calls window.CIVIC.* — kept next to the domain model
   (CAT/SEV/ST) it depends on. Schema per the integration brief.
   ============================================================ */
function normCat(v){ v=String(v||'').toLowerCase().trim();
  if(CAT[v]) return v;
  if(CATALIAS[v]) return CATALIAS[v];
  const map={yol:'roads',asfalt:'roads',road:'roads',pothole:'roads',
    su:'water',water:'water',flood:'water',subasma:'water',kanalizasiya:'water',
    təmizlik:'sanitation',zibil:'sanitation',garbage:'sanitation',waste:'sanitation',tullantı:'sanitation',
    yaşıllıq:'greenery',ağac:'greenery',tree:'greenery',greenery:'greenery',
    işıq:'lighting',isiq:'lighting',lighting:'lighting',lamp:'lighting',
    fasad:'facades',facade:'facades',facades:'facades',building:'facades',
    reklam:'signage',signage:'signage',sign:'signage',
    park:'parks',parks:'parks',
    tikinti:'construction',construction:'construction',
    buz:'seasonal',ice:'seasonal',seasonal:'seasonal',winter:'seasonal'};
  return map[v]||'other';
}
function normSev(v){ v=String(v||'').toLowerCase().trim();
  if(SEV[v]) return v;
  const map={aşağı:'low',asagi:'low',low:'low','1':'low',
    orta:'mid',mid:'mid',medium:'mid','2':'mid',
    yüksək:'high',yuksek:'high',high:'high','3':'high',
    kritik:'crit','çox yüksək':'crit',crit:'crit',critical:'crit',urgent:'crit','4':'crit'};
  return map[v]||'mid';
}
/* Decide the dashboard lifecycle from a DB record.
   Priority: explicit /statusText  →  legacy text /status  →  numeric /status flag (1=approved,0=pending). */
function lifecycleOf(d){
  if(d.statusText!=null && String(d.statusText).trim()!=='') return d.statusText;
  if(typeof d.status==='string' && !/^\d+$/.test(d.status.trim())) return d.status;
  return Number(d.status)===1 ? 'approved' : 'pending';
}
function normStatus(v){ v=String(v||'').toLowerCase().replace(/\s+/g,'_');
  const map={pending:'pending',new:'pending',
    approved:'approved',
    in_progress:'progress',inprogress:'progress',progress:'progress',davam_edir:'progress',
    proof:'proof',pending_proof:'proof',
    resolved:'resolved',closed:'resolved',done:'resolved',
    rejected:'rejected'};
  return map[v]||'pending';
}
function toDate(v, fallback){
  if(v==null||v==='') return fallback;
  if(typeof v==='number') return new Date(v);
  if(typeof v==='string'){
    if(/^\d+$/.test(v.trim())) return new Date(Number(v));
    const d=new Date(v); return isNaN(d)?fallback:d;
  }
  if(v.toDate) return v.toDate();
  if(v.seconds) return new Date(v.seconds*1000);
  const d=new Date(v); return isNaN(d)?fallback:d;
}
function firstSentence(t){ t=String(t).trim(); const m=t.match(/^[\s\S]*?[.!?](\s|$)/);
  let s=(m?m[0]:t).trim(); if(s.length>74) s=s.slice(0,74).trim()+'…'; return s; }

/* Realtime DB record → dashboard report (brief §4). `key` is the opaque /reports id. */
function mapDoc(key, d){
  d=d||{};
  const cat = CAT[d.categoryId] ? d.categoryId : normCat(d.categoryId || d.category);
  const sev = normSev(d.severity);
  const created = toDate(d.createdAt ?? d.createdAtISO, new Date());
  const ageH = Math.max(0,(NOW-created)/HOUR);
  const dlH = {low:120, mid:72, high:48, crit:24}[sev] || 72;
  const cost = Number(d.costMax ?? d.cost ?? d.costMin ?? 0)||0;
  const conf = Math.round(Number(d.confidence)||0)||80;
  return {
    id:String(key), docId:String(key),
    title: d.title || (d.explanation ? firstSentence(d.explanation) : (CAT[cat]||CAT.other).name),
    cat, sev, status: normStatus(lifecycleOf(d)),
    dept: d.department || d.dept || (CAT[cat]||CAT.other).dept,
    worker: d.worker || d.assignedTo || null,
    conf, cost,
    lat: Number((d.location&&d.location.lat) ?? d.lat ?? 40.41),
    lng: Number((d.location&&d.location.lng) ?? d.lng ?? 49.85),
    addr: d.address || 'Nərimanov rayonu, Bakı',
    note: d.note || '',
    reporter: d.reporter || null,
    aiExplanation: d.explanation || d.aiExplanation || AIEXP(cat,sev,cost),
    imageUrl: d.imageUrl || null,
    storagePath: d.storagePath || null,
    fixedImageUrl: d.fixedImageUrl || null,
    fixVerdict: d.fixVerdict || null,
    resolvedBy: d.resolvedBy || null,
    reopened: !!d.reopened,
    created, deadline:new Date(created.getTime()+dlH*HOUR),
    score: Math.min(100, Math.round(SEV[sev].w + ((CAT[cat]||CAT.other).urg) + Math.min(ageH/8,14))),
    createdAtMs: Number(d.createdAt) || created.getTime(),
  };
}
const DEMO_SEED = REPORTS.slice();   // keep demo data to show when the live DB is empty
function setReports(arr){
  REPORTS.length=0; arr.forEach(x=>REPORTS.push(x));
  if(state.view==='detail' && state.sel){
    const u=REPORTS.find(r=>String(r.id)===String(state.sel.id));
    if(u) state.sel=u;
    // don't blow away an in-progress upload / AI check
    if(state.fix.url || state.fix.verifying || state.proof.before || state.proof.after) return;
  }
  render();
}
/* called by firebase.js on every /reports snapshot */
function ingestLive(rows){
  if(rows && rows.length){
    rows.sort((a,b)=>(b.createdAtMs||0)-(a.createdAtMs||0));
    setReports(rows); setConn('live', rows.length);
  }else{
    setReports(DEMO_SEED.slice()); setConn('empty');
  }
}
function setConn(kind, n){
  const el=$('#fbStatus'); if(!el) return;
  if(kind==='live'){ el.className='fbchip fbchip--live'; el.innerHTML=`<span class="fbchip__dot"></span>Firebase · Canlı · ${n}`; }
  else if(kind==='empty'){ el.className='fbchip fbchip--live'; el.innerHTML=`<span class="fbchip__dot"></span>Canlı · baza boş (demo)`; }
  else if(kind==='error'){ el.className='fbchip fbchip--err'; el.innerHTML=`<span class="fbchip__dot"></span>Firebase xətası`; }
  else { el.className='fbchip'; el.innerHTML=`<span class="fbchip__dot"></span>Demo məlumatı`; }
}
window.CIVIC = { mapDoc, ingestLive, setReports, setConn, render:()=>render(), state };

/* ============================================================
   FEEDBACK live poll — /feedbacks (REST, read-only, brief §5)
   Same robust short-polling approach as firebase.js uses for /reports.
   ============================================================ */
(function feedbackPoll(){
  const cfg = window.FIREBASE_CONFIG || {};
  if(window.FIREBASE_ENABLED !== true || !cfg.databaseURL) return;   // demo fallback handles the rest
  const BASE = cfg.databaseURL.replace(/\/+$/,'');
  let lastSig = null;
  async function load(){
    try{
      const val = await fetch(`${BASE}/feedbacks.json?ts=${Date.now()}`, {cache:'no-store'}).then(r=>r.json());
      const sig = JSON.stringify(val);
      if(sig === lastSig) return;                  // unchanged → skip re-render
      lastSig = sig;
      FEEDBACK = val ? Object.keys(val)
        .filter(k => k && k !== 'counters' && val[k] && typeof val[k] === 'object')
        .map(k => mapFeedback(k, val[k]))
        .sort((a,b) => b.createdMs - a.createdMs)   // newest first
        : [];
      if(state.view === 'feedback') render();        // live-update the tab if it's open
    }catch(e){
      console.error('[CivicWave] /feedbacks oxuma xətası:', e);
    }
  }
  load();
  setInterval(load, 5000);
})();

/* ---------- INIT ---------- */
renderRole();
render();
setConn('demo');
