# CivicWave — Nərimanov Rayonu

AI ilə şəhər problemlərini bildirmək üçün mobil tətbiq (NYC 311 üslubunda, tamamilə Azərbaycan dilində). Hackathon prototipi — autentifikasiya tələb olunmur.

## İşə salmaq

```bash
npm install
npx expo start
```

Telefonda **Expo Go** ilə QR kodu skan edin (və ya `i` / `a` ilə simulyator).

## Əsas funksiyalar

- **Açılış animasiyası** — fırlanan logo (Reanimated) sonra tətbiq açılır.
- **AI ilə Ağıllı Seçim** — şəkil çəkilir, Gemini problemi avtomatik təyin edir (kateqoriya, ciddiyət, təxmini xərc, məsul idarə, əminlik). Əminlik < 85% olduqda AI dəqiqləşdirici suallar verir.
- **Məkan** — icazə alınır, GPS avtomatik ünvanı təyin edir.
- **HarAI** — Gemini əsaslı söhbət köməkçisi (ayrıca tab).
- **Xəritə** — rayondakı problemlərin canlı vizualizasiyası.
- **Müraciətlərim** — status izləmə (Təsdiq → Təsdiqləndi → İcrada → Həll olundu) + oyunlaşdırma (xal/sıralama).

## Konfiqurasiya

- **Açarlar (env)**: `.env.example` faylını `.env` adı ilə kopyalayın və `EXPO_PUBLIC_FIREBASE_*` və `EXPO_PUBLIC_GEMINI_API_KEY` dəyərlərini doldurun. Expo yalnız `EXPO_PUBLIC_` ön şəkilli dəyişənləri tətbiqə ötürür. Heç bir açar koda yazılmır.
- **Model**: `gemini-2.5-flash` (sürət üçün "thinking" söndürülüb).

## Logo dəyişmək

Hazırda yer tutucu logo `src/components/logo.tsx` (`LogoMark`) içindədir — gradient kvadrat + ikon.
Real logonu aldıqdan sonra:
1. Şəkli `assets/images/` qovluğuna əlavə edin.
2. `LogoMark` daxilindəki `Icon`-u `<Image source={require('@/assets/images/logo.png')} />` ilə əvəz edin.
   Logo splash-də (`src/components/splash-gate.tsx`) avtomatik fırlanmağa davam edəcək.

## Memarlıq

```
src/
  app/
    _layout.tsx              kök (providers + splash + stack)
    (tabs)/                  Ana Səhifə · Xəritə · HarAI · Müraciətlər
    report/new.tsx           çox-addımlı müraciət axını (AI + əl ilə)
  components/                 ui, tab-bar, splash-gate, scan-overlay, logo
  constants/                 design (tema) · categories (AZ kateqoriyalar)
  lib/                       gemini · location · store (AsyncStorage)
```
