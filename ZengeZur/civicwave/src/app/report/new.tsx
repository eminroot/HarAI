import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScanOverlay } from '@/components/scan-overlay';
import { Icon, PrimaryButton, SeverityBadge, Spinner, Tap } from '@/components/ui';
import {
  CATEGORY_ICON,
  CATEGORY_NAMES,
  CategoryId,
  DEPARTMENTS,
  SEVERITY_POINTS,
  Severity,
} from '@/constants/categories';
import { Gradients, Palette, Radius, Shadow, Space, Type } from '@/constants/design';
import { USER } from '@/constants/user';
import { submitFeedback, uploadReportToFirebase } from '@/lib/firebase';
import { AIAnalysis, classifyIssue, refineClassification } from '@/lib/gemini';
import { getCurrentPlace } from '@/lib/location';
import { NARIMANOV, useReports } from '@/lib/store';

type Step = 'capture' | 'analyzing' | 'result' | 'clarify' | 'location' | 'done';

const PHOTO_H = 280;

export default function NewReport() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addReport, setFirebaseId } = useReports();
  const params = useLocalSearchParams<{ mode?: string; category?: string; service?: string }>();
  const lockedCategory = (params.category as CategoryId) || null;
  const isAiMode = params.mode === 'ai' || !lockedCategory;

  const [step, setStep] = useState<Step>('capture');
  const [photo, setPhoto] = useState<{ uri: string; base64: string; mime: string } | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [note, setNote] = useState('');

  // location state
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [place, setPlace] = useState<{ lat: number; lng: number; address: string } | null>(null);

  // firebase sync status
  const [synced, setSynced] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [reportId, setReportId] = useState<string | null>(null);

  const pickFrom = useCallback(async (source: 'camera' | 'library') => {
    try {
      if (source === 'camera') {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          setError('Kamera icazəsi verilmədi');
          return;
        }
      }
      const res =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.6 })
          : await ImagePicker.launchImageLibraryAsync({
              base64: true,
              quality: 0.6,
              mediaTypes: 'images',
            });
      if (res.canceled || !res.assets?.[0]?.base64) return;
      const a = res.assets[0];
      const mime = a.mimeType || 'image/jpeg';
      setPhoto({ uri: a.uri, base64: a.base64!, mime });
      runAnalysis(a.base64!, mime);
    } catch (e: any) {
      setError(e?.message || 'Şəkil seçilə bilmədi');
    }
  }, []);

  const runAnalysis = useCallback(
    async (base64: string, mime: string) => {
      setStep('analyzing');
      setError(null);
      try {
        const result = await classifyIssue(base64, mime, note || undefined);
        // honour the citizen's manual category choice for routing
        if (lockedCategory) {
          result.categoryId = lockedCategory;
          result.categoryName = CATEGORY_NAMES[lockedCategory];
          result.department = DEPARTMENTS[lockedCategory];
        }
        setAnalysis(result);
        if (!result.imageQualityOk) {
          setStep('capture');
          setError(result.retakeReason || 'Şəkil keyfiyyəti aşağıdır, yenidən çəkin');
          setPhoto(null);
          return;
        }
        if (result.confidence < 85 && result.clarifyingQuestions.length > 0) {
          setAnswers(new Array(result.clarifyingQuestions.length).fill(''));
          setStep('clarify');
        } else {
          setStep('result');
        }
      } catch (e: any) {
        // graceful fallback so the demo never dead-ends
        const fallbackCat = lockedCategory || 'roads';
        setAnalysis({
          imageQualityOk: true,
          categoryId: fallbackCat,
          categoryName: CATEGORY_NAMES[fallbackCat],
          severity: 'medium',
          severityReason: 'Avtomatik təyin edildi',
          costMin: 100,
          costMax: 300,
          department: DEPARTMENTS[fallbackCat],
          confidence: 70,
          summary: 'AI bağlantısı alınmadı, məlumatları əl ilə təsdiqləyin.',
          clarifyingQuestions: [],
        });
        setError('AI bağlantısı zəifdir — nəticəni əl ilə təsdiqləyə bilərsiniz.');
        setStep('result');
      }
    },
    [note, lockedCategory]
  );

  const submitAnswers = useCallback(async () => {
    if (!photo || !analysis) return;
    setStep('analyzing');
    try {
      const qa = analysis.clarifyingQuestions.map((q, i) => ({
        question: q,
        answer: answers[i] || 'Bilmirəm',
      }));
      const refined = await refineClassification(photo.base64, photo.mime, qa, note || undefined);
      if (lockedCategory) {
        refined.categoryId = lockedCategory;
        refined.categoryName = CATEGORY_NAMES[lockedCategory];
        refined.department = DEPARTMENTS[lockedCategory];
      }
      setAnalysis(refined);
    } catch {
      // keep prior analysis
    }
    setStep('result');
  }, [photo, analysis, answers, note, lockedCategory]);

  const goLocation = useCallback(async () => {
    setStep('location');
    setLoadingLoc(true);
    try {
      const p = await getCurrentPlace();
      setPlace(p);
    } catch {
      setPlace({ ...NARIMANOV, address: 'Nərimanov rayonu (məkan əl ilə daxil edin)' });
    } finally {
      setLoadingLoc(false);
    }
  }, []);

  const submit = useCallback(() => {
    if (!analysis || !place) return;
    const local = addReport({
      categoryId: analysis.categoryId,
      categoryName: analysis.categoryName,
      title: analysis.summary || analysis.categoryName,
      severity: analysis.severity,
      department: analysis.department,
      costMin: analysis.costMin,
      costMax: analysis.costMax,
      confidence: analysis.confidence,
      note: note || undefined,
      photoUri: photo?.uri,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      firstReporter: true,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setStep('done');

    // Upload to Firebase (Storage + Realtime DB) in the background so the success screen is instant.
    if (photo) {
      setSynced('uploading');
      uploadReportToFirebase({
        uri: photo.uri,
        mime: photo.mime,
        explanation: analysis.summary || analysis.categoryName,
        category: analysis.categoryName,
        categoryId: analysis.categoryId,
        severity: analysis.severity,
        department: analysis.department,
        confidence: analysis.confidence,
        note: note || undefined,
        address: place.address,
        lat: place.lat,
        lng: place.lng,
        reporter: USER.fullName,
      })
        .then((res) => {
          setReportId(res.id);
          // Link the local report to its Firebase key so the Müraciətlər list can
          // track the officer's Approve/Reject decision in realtime.
          setFirebaseId(local.id, res.id);
          setSynced('done');
        })
        .catch((e) => {
          console.warn('Firebase upload failed:', e?.message || e);
          setSynced('error');
        });
    }
  }, [analysis, place, note, photo, addReport, setFirebaseId]);

  return (
    <View style={{ flex: 1, backgroundColor: Palette.bg }}>
      {/* Top bar */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: Space.lg,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: Palette.surface,
          ...Shadow.soft,
        }}>
        <Tap onPress={() => router.back()} haptic={false}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: Palette.surfaceAlt,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="close" set="ion" size={22} color={Palette.text} />
          </View>
        </Tap>
        <View style={{ flex: 1 }}>
          <Text style={{ ...Type.h3, color: Palette.text }}>
            {isAiMode ? 'AI ilə Ağıllı Seçim' : CATEGORY_NAMES[lockedCategory!]}
          </Text>
          <Text style={{ ...Type.small, color: Palette.textMuted }}>Yeni müraciət</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 56}>
        <ScrollView
          contentContainerStyle={{ padding: Space.lg, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
        {step === 'capture' && (
          <CaptureStep
            isAiMode={isAiMode}
            error={error}
            onPick={pickFrom}
            categoryId={lockedCategory}
          />
        )}

        {step === 'analyzing' && photo && (
          <Animated.View entering={FadeIn} style={{ alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                height: PHOTO_H,
                borderRadius: 18,
                overflow: 'hidden',
                borderCurve: 'continuous',
              }}>
              <Image source={{ uri: photo.uri }} style={{ flex: 1 }} contentFit="cover" />
              <ScanOverlay height={PHOTO_H} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 22 }}>
              <Spinner size={20} color={Palette.ai1} />
              <Text style={{ ...Type.h3, color: Palette.text }}>Süni intellekt analiz edir…</Text>
            </View>
            <Text style={{ ...Type.small, color: Palette.textMuted, marginTop: 6 }}>
              Problem növü, ciddiyət və məsul idarə təyin edilir
            </Text>
          </Animated.View>
        )}

        {step === 'clarify' && analysis && (
          <ClarifyStep
            analysis={analysis}
            answers={answers}
            setAnswers={setAnswers}
            onSubmit={submitAnswers}
          />
        )}

        {step === 'result' && analysis && (
          <ResultStep
            analysis={analysis}
            photoUri={photo?.uri}
            error={error}
            onConfirm={goLocation}
            onRetake={() => {
              setPhoto(null);
              setAnalysis(null);
              setError(null);
              setStep('capture');
            }}
          />
        )}

        {step === 'location' && analysis && (
          <LocationStep
            loading={loadingLoc}
            place={place}
            setAddress={(a) => place && setPlace({ ...place, address: a })}
            note={note}
            setNote={setNote}
            onRetry={goLocation}
            onSubmit={submit}
          />
        )}

        {step === 'done' && analysis && (
          <DoneStep
            analysis={analysis}
            synced={synced}
            reportId={reportId}
            onClose={() => router.replace('/reports')}
          />
        )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------------- Steps ---------------- */

function CaptureStep({
  isAiMode,
  error,
  onPick,
  categoryId,
}: {
  isAiMode: boolean;
  error: string | null;
  onPick: (s: 'camera' | 'library') => void;
  categoryId: CategoryId | null;
}) {
  const cat = categoryId ? CATEGORY_ICON[categoryId] : null;
  return (
    <Animated.View entering={FadeInDown.duration(450)}>
      <View
        style={{
          alignItems: 'center',
          paddingVertical: Space.xxl,
          backgroundColor: Palette.surface,
          borderRadius: Radius.xl,
          borderCurve: 'continuous',
          ...Shadow.card,
        }}>
        <LinearGradient
          colors={isAiMode ? Gradients.ai : Gradients.brand}
          style={{
            width: 88,
            height: 88,
            borderRadius: 28,
            borderCurve: 'continuous',
            alignItems: 'center',
            justifyContent: 'center',
            ...Shadow.raised,
          }}>
          <Icon
            name={isAiMode ? 'sparkles' : (cat?.icon ?? 'camera')}
            set={isAiMode ? 'ion' : (categoryId ? cat!.iconSet : 'mci')}
            size={42}
            color="#fff"
          />
        </LinearGradient>
        <Text style={{ ...Type.title, color: Palette.text, marginTop: Space.lg, textAlign: 'center' }}>
          Problemin şəklini çəkin
        </Text>
        <Text
          style={{
            ...Type.body,
            color: Palette.textMuted,
            textAlign: 'center',
            marginTop: 6,
            paddingHorizontal: Space.xl,
          }}>
          {isAiMode
            ? 'Süni intellekt şəkli analiz edib problemi avtomatik təyin edəcək.'
            : 'Daha aydın şəkil — daha dəqiq nəticə deməkdir.'}
        </Text>
      </View>

      {error && (
        <Animated.View
          entering={FadeIn}
          style={{
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            backgroundColor: Palette.criticalSoft,
            padding: 12,
            borderRadius: Radius.md,
            marginTop: Space.lg,
          }}>
          <Icon name="alert-circle" set="ion" size={18} color={Palette.critical} />
          <Text style={{ ...Type.small, color: Palette.critical, flex: 1 }}>{error}</Text>
        </Animated.View>
      )}

      <View style={{ gap: 12, marginTop: Space.xl }}>
        <PrimaryButton
          label="Kamera ilə çək"
          icon="camera"
          gradient={Gradients.brand}
          onPress={() => onPick('camera')}
        />
        <Tap onPress={() => onPick('library')}>
          <View
            style={{
              height: 56,
              borderRadius: Radius.md,
              borderCurve: 'continuous',
              backgroundColor: Palette.surface,
              borderWidth: 1.5,
              borderColor: Palette.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
            }}>
            <Icon name="images-outline" set="ion" size={20} color={Palette.text} />
            <Text style={{ ...Type.h3, color: Palette.text }}>Qalereyadan seç</Text>
          </View>
        </Tap>
      </View>
    </Animated.View>
  );
}

function ConfidenceMeter({ value }: { value: number }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withTiming(value, { duration: 900 });
  }, [value, w]);
  const barStyle = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  const color = value >= 85 ? Palette.low : value >= 60 ? Palette.medium : Palette.critical;
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ ...Type.small, color: Palette.textMuted }}>AI əminliyi</Text>
        <Text style={{ ...Type.bodyStrong, color }}>{value}%</Text>
      </View>
      <View
        style={{
          height: 10,
          borderRadius: 6,
          backgroundColor: Palette.surfaceAlt,
          overflow: 'hidden',
        }}>
        <Animated.View style={[{ height: '100%', borderRadius: 6, backgroundColor: color }, barStyle]} />
      </View>
    </View>
  );
}

function ResultStep({
  analysis,
  photoUri,
  error,
  onConfirm,
  onRetake,
}: {
  analysis: AIAnalysis;
  photoUri?: string;
  error: string | null;
  onConfirm: () => void;
  onRetake: () => void;
}) {
  const cat = CATEGORY_ICON[analysis.categoryId];
  return (
    <Animated.View entering={FadeInDown.duration(450)}>
      {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={{ width: '100%', height: 180, borderRadius: 18, marginBottom: Space.lg }}
          contentFit="cover"
        />
      )}

      <View
        style={{
          backgroundColor: Palette.surface,
          borderRadius: Radius.xl,
          borderCurve: 'continuous',
          padding: Space.xl,
          ...Shadow.card,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              borderCurve: 'continuous',
              backgroundColor: cat.color + '1A',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name={cat.icon} set={cat.iconSet} size={28} color={cat.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...Type.small, color: Palette.textMuted }}>Təyin edilən problem</Text>
            <Text style={{ ...Type.h2, color: Palette.text }}>{analysis.categoryName}</Text>
          </View>
          <SeverityBadge severity={analysis.severity} />
        </View>

        {analysis.summary ? (
          <Text style={{ ...Type.body, color: Palette.textMuted, marginTop: 14 }}>
            {analysis.summary}
          </Text>
        ) : null}

        <View style={{ height: 1, backgroundColor: Palette.border, marginTop: Space.lg }} />

        <DetailRow icon="office-building-marker" label="Məsul idarə" value={analysis.department} last />

        <View style={{ height: 1, backgroundColor: Palette.border, marginBottom: Space.lg }} />

        <ConfidenceMeter value={analysis.confidence} />
      </View>

      {error && (
        <Text style={{ ...Type.small, color: Palette.medium, marginTop: Space.md, textAlign: 'center' }}>
          {error}
        </Text>
      )}

      <View style={{ marginTop: Space.xl }}>
        <Text style={{ ...Type.h3, color: Palette.text, textAlign: 'center', marginBottom: 14 }}>
          Bu düzdür?
        </Text>
        <PrimaryButton label="Bəli, davam et" icon="checkmark" onPress={onConfirm} />
        <Tap onPress={onRetake} style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 12 }}>
            <Icon name="camera-reverse-outline" set="ion" size={18} color={Palette.textMuted} />
            <Text style={{ ...Type.bodyStrong, color: Palette.textMuted }}>Şəkli yenidən çək</Text>
          </View>
        </Tap>
      </View>
    </Animated.View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  last,
}: {
  icon: string;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: Palette.border,
      }}>
      <Icon name={icon} size={20} color={Palette.textMuted} />
      <Text style={{ ...Type.body, color: Palette.textMuted }}>{label}</Text>
      <Text
        style={{
          ...Type.bodyStrong,
          color: Palette.text,
          marginLeft: 'auto',
          flexShrink: 1,
          textAlign: 'right',
        }}>
        {value}
      </Text>
    </View>
  );
}

function ClarifyStep({
  analysis,
  answers,
  setAnswers,
  onSubmit,
}: {
  analysis: AIAnalysis;
  answers: string[];
  setAnswers: (a: string[]) => void;
  onSubmit: () => void;
}) {
  const canSubmit = answers.some((a) => a.trim().length > 0);
  return (
    <Animated.View entering={FadeInDown.duration(450)}>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          backgroundColor: Palette.primarySoft,
          padding: 14,
          borderRadius: Radius.md,
          marginBottom: Space.lg,
        }}>
        <Icon name="sparkles" set="ion" size={20} color={Palette.ai1} />
        <Text style={{ ...Type.small, color: Palette.text, flex: 1 }}>
          Dəqiq təyin etmək üçün bir neçə sual ({analysis.confidence}% əminlik)
        </Text>
      </View>

      {analysis.clarifyingQuestions.map((q, i) => (
        <View key={i} style={{ marginBottom: Space.lg }}>
          <Text style={{ ...Type.bodyStrong, color: Palette.text, marginBottom: 8 }}>{q}</Text>
          <TextInput
            value={answers[i]}
            onChangeText={(t) => {
              const next = [...answers];
              next[i] = t;
              setAnswers(next);
            }}
            placeholder="Cavabınız…"
            placeholderTextColor={Palette.textFaint}
            multiline
            style={{
              ...Type.body,
              color: Palette.text,
              backgroundColor: Palette.surface,
              borderRadius: Radius.md,
              borderWidth: 1,
              borderColor: Palette.border,
              padding: 14,
              minHeight: 54,
            }}
          />
        </View>
      ))}

      <PrimaryButton
        label="Təsdiqlə və davam et"
        icon="arrow-forward"
        gradient={Gradients.ai}
        disabled={!canSubmit}
        onPress={onSubmit}
      />
    </Animated.View>
  );
}

function LocationStep({
  loading,
  place,
  setAddress,
  note,
  setNote,
  onRetry,
  onSubmit,
}: {
  loading: boolean;
  place: { lat: number; lng: number; address: string } | null;
  setAddress: (a: string) => void;
  note: string;
  setNote: (s: string) => void;
  onRetry: () => void;
  onSubmit: () => void;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(450)}>
      <Text style={{ ...Type.title, color: Palette.text, marginBottom: 6 }}>Məkanı təsdiqləyin</Text>
      <Text style={{ ...Type.body, color: Palette.textMuted, marginBottom: Space.lg }}>
        Problemin dəqiq yeri avtomatik təyin olundu.
      </Text>

      {/* faux map card with pin */}
      <View
        style={{
          height: 170,
          borderRadius: Radius.lg,
          borderCurve: 'continuous',
          overflow: 'hidden',
          marginBottom: Space.lg,
          ...Shadow.card,
        }}>
        <LinearGradient colors={Gradients.map} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/* grid lines */}
          {[40, 90, 130].map((t) => (
            <View key={t} style={{ position: 'absolute', top: t, left: 0, right: 0, height: 1, backgroundColor: 'rgba(30,107,241,0.08)' }} />
          ))}
          {[60, 150, 240, 320].map((l) => (
            <View key={l} style={{ position: 'absolute', left: l, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(30,107,241,0.08)' }} />
          ))}
          {loading ? (
            <ActivityIndicator color={Palette.primary} />
          ) : (
            <Animated.View entering={ZoomIn.springify().damping(12)} style={{ alignItems: 'center' }}>
              <View style={{ ...Shadow.raised, borderRadius: 30 }}>
                <Icon name="map-marker" size={48} color={Palette.primary} />
              </View>
            </Animated.View>
          )}
        </LinearGradient>
      </View>

      <View
        style={{
          backgroundColor: Palette.surface,
          borderRadius: Radius.lg,
          borderCurve: 'continuous',
          padding: Space.lg,
          ...Shadow.card,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Icon name="location" set="ion" size={18} color={Palette.primary} />
          <Text style={{ ...Type.tiny, color: Palette.textMuted }}>ÜNVAN</Text>
          {place && !loading && (
            <Tap onPress={onRetry} haptic={false} style={{ marginLeft: 'auto' }}>
              <Icon name="refresh" set="ion" size={16} color={Palette.primary} />
            </Tap>
          )}
        </View>
        <TextInput
          value={place?.address ?? ''}
          onChangeText={setAddress}
          editable={!loading}
          placeholder="Ünvanı daxil edin"
          placeholderTextColor={Palette.textFaint}
          style={{ ...Type.bodyStrong, color: Palette.text }}
        />
        {place && (
          <Text style={{ ...Type.small, color: Palette.textFaint, marginTop: 6 }}>
            {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
          </Text>
        )}
      </View>

      <Text style={{ ...Type.h3, color: Palette.text, marginTop: Space.xl, marginBottom: 10 }}>
        Əlavə qeyd (istəyə bağlı)
      </Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Əlavə məlumat yazın…"
        placeholderTextColor={Palette.textFaint}
        multiline
        style={{
          ...Type.body,
          color: Palette.text,
          backgroundColor: Palette.surface,
          borderRadius: Radius.md,
          borderWidth: 1,
          borderColor: Palette.border,
          padding: 14,
          minHeight: 80,
          textAlignVertical: 'top',
        }}
      />

      <View style={{ marginTop: Space.xl }}>
        <PrimaryButton label="Müraciəti göndər" icon="paper-plane" onPress={onSubmit} disabled={loading} />
      </View>
    </Animated.View>
  );
}

function DoneStep({
  analysis,
  synced,
  reportId,
  onClose,
}: {
  analysis: AIAnalysis;
  synced: 'idle' | 'uploading' | 'done' | 'error';
  reportId: string | null;
  onClose: () => void;
}) {
  const sync = {
    idle: null,
    uploading: { icon: 'cloud-upload-outline', color: Palette.textMuted, text: 'Buludla sinxronlaşdırılır…' },
    done: { icon: 'cloud-done-outline', color: Palette.low, text: 'Mərkəzi sistemə göndərildi' },
    error: { icon: 'cloud-offline-outline', color: Palette.medium, text: 'Oflayn saxlanıldı, sonra göndəriləcək' },
  }[synced];
  return (
    <Animated.View entering={FadeIn.duration(400)} style={{ alignItems: 'center', paddingTop: Space.xxxl }}>
      <Animated.View entering={ZoomIn.springify().damping(10).delay(100)}>
        <LinearGradient
          colors={[Palette.low, '#0E9F6E']}
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            alignItems: 'center',
            justifyContent: 'center',
            ...Shadow.raised,
          }}>
          <Icon name="checkmark" set="ion" size={64} color="#fff" />
        </LinearGradient>
      </Animated.View>
      <Text style={{ ...Type.title, color: Palette.text, marginTop: Space.xl }}>Müraciət göndərildi!</Text>
      <Text style={{ ...Type.body, color: Palette.textMuted, textAlign: 'center', marginTop: 8, paddingHorizontal: Space.lg }}>
        Müraciətiniz {analysis.department} idarəsinə yönləndirildi. Təsdiqlədikdən sonra{' '}
        <Text style={{ color: Palette.text, fontWeight: '700' }}>+{SEVERITY_POINTS[analysis.severity]} xal</Text>{' '}
        qazanacaqsınız.
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: Palette.lowSoft,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: Radius.pill,
          marginTop: Space.lg,
        }}>
        <Icon name="trophy" set="ion" size={16} color={Palette.low} />
        <Text style={{ ...Type.small, color: '#0E7C4B' }}>İlk bildirən bonusu: +15 xal</Text>
      </View>

      {sync && (
        <Animated.View
          entering={FadeIn}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: Space.md }}>
          <Icon name={sync.icon} set="ion" size={15} color={sync.color} />
          <Text style={{ ...Type.small, color: sync.color }}>{sync.text}</Text>
        </Animated.View>
      )}

      <FeedbackCard reportId={reportId} category={analysis.categoryName} />

      <View style={{ width: '100%', marginTop: Space.xl }}>
        <PrimaryButton label="Müraciətlərimə bax" icon="list" onPress={onClose} />
      </View>
    </Animated.View>
  );
}

function StarRow({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: Space.lg }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Tap key={n} onPress={() => onChange(n)} scaleTo={0.82} haptic>
          <Icon
            name={n <= value ? 'star' : 'star-outline'}
            set="ion"
            size={40}
            color={n <= value ? Palette.medium : Palette.borderStrong}
          />
        </Tap>
      ))}
    </View>
  );
}

const RATING_LABEL: Record<number, string> = {
  1: 'Çox pis',
  2: 'Pis',
  3: 'Normal',
  4: 'Yaxşı',
  5: 'Əla',
};

function FeedbackCard({ reportId, category }: { reportId: string | null; category: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const send = useCallback(async () => {
    if (rating < 1 || state === 'sending') return;
    setState('sending');
    try {
      await submitFeedback({
        rating,
        comment: comment.trim() || undefined,
        reportId: reportId ?? undefined,
        category,
        reporter: USER.fullName,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setState('sent');
    } catch {
      setState('error');
    }
  }, [rating, comment, reportId, category, state]);

  if (state === 'sent') {
    return (
      <Animated.View
        entering={FadeIn.duration(350)}
        style={{
          width: '100%',
          alignItems: 'center',
          backgroundColor: Palette.surface,
          borderRadius: Radius.xl,
          borderCurve: 'continuous',
          padding: Space.xl,
          marginTop: Space.xxl,
          ...Shadow.card,
        }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: Palette.lowSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="heart" set="ion" size={26} color={Palette.low} />
        </View>
        <Text style={{ ...Type.h3, color: Palette.text, marginTop: 12 }}>Rəyiniz üçün təşəkkürlər!</Text>
        <Text style={{ ...Type.small, color: Palette.textMuted, textAlign: 'center', marginTop: 4 }}>
          Fikirləriniz xidməti yaxşılaşdırmağa kömək edir.
        </Text>
      </Animated.View>
    );
  }

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: Palette.surface,
        borderRadius: Radius.xl,
        borderCurve: 'continuous',
        padding: Space.xl,
        marginTop: Space.xxl,
        ...Shadow.card,
      }}>
      <Text style={{ ...Type.h3, color: Palette.text, textAlign: 'center' }}>
        Təcrübənizi qiymətləndirin
      </Text>
      <Text style={{ ...Type.small, color: Palette.textMuted, textAlign: 'center', marginTop: 4 }}>
        Müraciət prosesi sizin üçün necə keçdi?
      </Text>

      <StarRow value={rating} onChange={setRating} />

      <Text
        style={{
          ...Type.small,
          color: rating > 0 ? Palette.medium : Palette.textFaint,
          textAlign: 'center',
          marginTop: -6,
          marginBottom: Space.md,
          height: 18,
        }}>
        {rating > 0 ? RATING_LABEL[rating] : ' '}
      </Text>

      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Şərhinizi yazın (istəyə bağlı)…"
        placeholderTextColor={Palette.textFaint}
        multiline
        style={{
          ...Type.body,
          color: Palette.text,
          backgroundColor: Palette.surfaceAlt,
          borderRadius: Radius.md,
          borderWidth: 1,
          borderColor: Palette.border,
          padding: 14,
          minHeight: 80,
          textAlignVertical: 'top',
          marginBottom: Space.lg,
        }}
      />

      {state === 'error' && (
        <Text style={{ ...Type.small, color: Palette.critical, textAlign: 'center', marginBottom: Space.md }}>
          Rəy göndərilmədi — yenidən cəhd edin.
        </Text>
      )}

      <PrimaryButton
        label="Rəyi göndər"
        icon="paper-plane"
        loading={state === 'sending'}
        disabled={rating < 1}
        onPress={send}
      />
    </View>
  );
}
