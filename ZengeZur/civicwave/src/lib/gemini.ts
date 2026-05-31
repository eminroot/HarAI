/**
 * Gemini integration for CivicWave.
 * - classifyIssue: multimodal photo analysis -> category, severity, cost, department, confidence, clarifying Qs
 * - refineClassification: re-run after the citizen answers clarifying questions
 * - humaiReply: text chat for the HarAI assistant
 *
 * The API key is read from the environment (Expo inlines `EXPO_PUBLIC_*` vars at
 * build time) so no secret is committed to git — see `.env.example`. In production
 * these calls should still be proxied through a backend so the key is never shipped.
 */
import {
  CATEGORY_NAMES,
  CategoryId,
  DEPARTMENTS,
  Severity,
} from '@/constants/categories';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export type AIAnalysis = {
  imageQualityOk: boolean;
  retakeReason?: string;
  categoryId: CategoryId;
  categoryName: string;
  severity: Severity;
  severityReason: string;
  costMin: number;
  costMax: number;
  department: string;
  confidence: number; // 0-100
  summary: string;
  clarifyingQuestions: string[];
};

const CATEGORY_LIST = (Object.keys(CATEGORY_NAMES) as CategoryId[])
  .map((id) => `- ${id}: ${CATEGORY_NAMES[id]} (məsul: ${DEPARTMENTS[id]})`)
  .join('\n');

const SYSTEM_RULES = `Sən Nərimanov rayonu (Bakı, Azərbaycan) üçün "CivicWave" şəhər problemləri təsnifat sistemisən.
Vətəndaşın çəkdiyi şəkli analiz et və problemi aşağıdakı kateqoriyalardan BİRİNƏ təsnif et:
${CATEGORY_LIST}

Bütün mətnlər AZƏRBAYCAN dilində olmalıdır.
Ciddiyət (severity): "low" (aşağı), "medium" (orta), "critical" (kritik).
Təmir xərci ₼ (AZN) ilə real qiymət aralığı ver (costMin, costMax).
confidence: 0-100 arası əminlik faizi.
Əgər şəkil bulanıq, qaranlıq və ya problemi göstərmirsə, imageQualityOk=false və retakeReason yaz.
Əgər əminlik 85-dən aşağıdırsa, clarifyingQuestions sahəsində 1-2 qısa dəqiqləşdirici sual ver (Azərbaycan dilində). Əks halda boş massiv.

YALNIZ aşağıdakı JSON formatında cavab ver, başqa heç nə yazma:
{
  "imageQualityOk": boolean,
  "retakeReason": string,
  "categoryId": one of [${(Object.keys(CATEGORY_NAMES) as CategoryId[]).map((c) => `"${c}"`).join(', ')}],
  "severity": "low" | "medium" | "critical",
  "severityReason": string,
  "costMin": number,
  "costMax": number,
  "confidence": number,
  "summary": string,
  "clarifyingQuestions": string[]
}`;

type GeminiPart = { text: string } | { inline_data: { mime_type: string; data: string } };

async function callGemini(parts: GeminiPart[], jsonMode: boolean): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.4,
        thinkingConfig: { thinkingBudget: 0 },
        ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
      },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini ${res.status}: ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  const text: string | undefined = json?.candidates?.[0]?.content?.parts
    ?.map((p: any) => p?.text ?? '')
    .join('');
  if (!text) throw new Error('Gemini boş cavab qaytardı');
  return text;
}

function parseJson<T>(raw: string): T {
  let s = raw.trim();
  // strip ```json fences if present
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start >= 0 && end > start) s = s.slice(start, end + 1);
  return JSON.parse(s) as T;
}

function normalize(raw: any): AIAnalysis {
  const categoryId: CategoryId = (CATEGORY_NAMES as any)[raw.categoryId]
    ? raw.categoryId
    : 'roads';
  const severity: Severity = ['low', 'medium', 'critical'].includes(raw.severity)
    ? raw.severity
    : 'medium';
  return {
    imageQualityOk: raw.imageQualityOk !== false,
    retakeReason: raw.retakeReason || undefined,
    categoryId,
    categoryName: CATEGORY_NAMES[categoryId],
    severity,
    severityReason: raw.severityReason || '',
    costMin: Number(raw.costMin) || 0,
    costMax: Number(raw.costMax) || 0,
    department: DEPARTMENTS[categoryId],
    confidence: Math.max(0, Math.min(100, Math.round(Number(raw.confidence) || 0))),
    summary: raw.summary || '',
    clarifyingQuestions: Array.isArray(raw.clarifyingQuestions)
      ? raw.clarifyingQuestions.filter((q: any) => typeof q === 'string').slice(0, 2)
      : [],
  };
}

export async function classifyIssue(
  base64: string,
  mimeType: string,
  note?: string
): Promise<AIAnalysis> {
  const parts: GeminiPart[] = [
    { text: SYSTEM_RULES },
    ...(note ? [{ text: `Vətəndaşın qeydi: ${note}` } as GeminiPart] : []),
    { text: 'Bu şəkildəki şəhər problemini analiz et:' },
    { inline_data: { mime_type: mimeType, data: base64 } },
  ];
  const raw = await callGemini(parts, true);
  return normalize(parseJson<any>(raw));
}

export async function refineClassification(
  base64: string,
  mimeType: string,
  qa: { question: string; answer: string }[],
  note?: string
): Promise<AIAnalysis> {
  const qaText = qa.map((x) => `S: ${x.question}\nC: ${x.answer}`).join('\n');
  const parts: GeminiPart[] = [
    { text: SYSTEM_RULES },
    { text: `Vətəndaş bu dəqiqləşdirici suallara cavab verdi:\n${qaText}` },
    ...(note ? [{ text: `Əlavə qeyd: ${note}` } as GeminiPart] : []),
    {
      text: 'Bu cavabları nəzərə alaraq təsnifatı yenidən dəqiqləşdir və əminliyi yenilə. clarifyingQuestions indi boş olmalıdır.',
    },
    { inline_data: { mime_type: mimeType, data: base64 } },
  ];
  const raw = await callGemini(parts, true);
  const result = normalize(parseJson<any>(raw));
  result.clarifyingQuestions = [];
  return result;
}

const HUMAI_SYSTEM = `Sən "HarAI" adlı köməkçisən — Nərimanov rayonu (Bakı) sakinləri üçün şəhər xidmətləri üzrə süni intellekt köməkçisi.
Sənin adın HarAI-dır. Kimsə adını soruşsa və ya səni təqdim etmək lazım olsa, adının HarAI olduğunu de.
Vəzifən: sakinlərə şəhər problemlərini (yol, işıqlandırma, zibil, yaşıllıq, subasma, fasad, reklam, park, tikinti, buzlaşma) bildirməkdə kömək etmək, hansı idarənin məsul olduğunu izah etmək və müraciət prosesini sadələşdirmək.
Həmişə Azərbaycan dilində, qısa, mehriban və aydın cavab ver. Lazım olduqda vətəndaşı "AI Smart Select" ilə şəkil çəkməyə yönəlt.

FORMAT QAYDALARI (mütləq):
- Yalnız adi mətnlə (plain text) yaz.
- Heç bir markdown və ya formatlaşdırma işarəsi işlətmə: **qalın**, *kursiv*, _alt xətt_, # başlıq, \`kod\`, markdown siyahıları — qadağandır.
- Heç bir emoji, simvol, ASCII üz və ya stiker işlətmə.
- Vurğu üçün ulduz (*) və ya alt xətt (_) yox, sadəcə adi sözlərdən istifadə et.`;

export type ChatMsg = { role: 'user' | 'model'; text: string };

// Matches emoji / pictographs / symbols / variation selectors / regional indicators / ZWJ.
const EMOJI_RE =
  /[\u{1F000}-\u{1FAFF}\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{2122}\u{2139}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{200D}\u{20E3}]/gu;

/**
 * Models frequently ignore "no markdown / no emoji" instructions, so we hard-strip
 * formatting from the reply as a guarantee: bold/italic markers, code fences/ticks,
 * heading/list markers and any emoji or pictographic characters.
 */
export function sanitizeReply(text: string): string {
  return text
    // code fences ```...``` and inline `code` -> keep the inner text
    .replace(/```[a-zA-Z]*\n?/g, '')
    .replace(/```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // markdown headings and bullet/quote markers at line start (before emphasis,
    // so a leading "* " bullet isn't mistaken for italic spanning the next line)
    .replace(/^\s{0,3}#{1,6}\s*/gm, '')
    .replace(/^\s{0,3}[*+\-]\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    // **bold**, __bold__, *italic*, _italic_ -> inner text (single line only)
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    .replace(/__([^_\n]+)__/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/_([^_\n]+)_/g, '$1')
    // any leftover emphasis/code characters
    .replace(/[*_`#]/g, '')
    // emojis / stickers / symbols
    .replace(EMOJI_RE, '')
    // tidy up whitespace the removals may have left behind
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/ +\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function humaiReply(history: ChatMsg[], userText: string): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: HUMAI_SYSTEM }] },
      contents: [
        ...history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: userText }] },
      ],
      generationConfig: { temperature: 0.6, thinkingConfig: { thinkingBudget: 0 } },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini ${res.status}: ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  const text: string | undefined = json?.candidates?.[0]?.content?.parts
    ?.map((p: any) => p?.text ?? '')
    .join('');
  const clean = text ? sanitizeReply(text) : '';
  return clean || 'Bağışlayın, cavab verə bilmədim. Yenidən cəhd edin.';
}
