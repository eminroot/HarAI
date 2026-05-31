import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Tap } from '@/components/ui';
import { Gradients, Palette, Radius, Shadow, Space, Type } from '@/constants/design';
import { ChatMsg, humaiReply } from '@/lib/gemini';

const SUGGESTIONS = [
  'Yolda çuxur var, nə edim?',
  'Zibil konteyneri daşıb',
  'Küçə işığı yanmır',
  'Hansı idarə məsuldur?',
];

type Bubble = { id: string; role: 'user' | 'model'; text: string };

export default function HarAI() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Bubble[]>([
    {
      id: 'intro',
      role: 'model',
      text: 'Salam! Mən HarAI — Nərimanov rayonu üçün şəhər köməkçinizəm. Şəhərdə bir problem görmüsünüz? Mənə danışın, kömək edim.',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [kbVisible, setKbVisible] = useState(false);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const s = Keyboard.addListener(showEvt, () => setKbVisible(true));
    const h = Keyboard.addListener(hideEvt, () => setKbVisible(false));
    return () => {
      s.remove();
      h.remove();
    };
  }, []);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const userMsg: Bubble = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    const history: ChatMsg[] = messages
      .filter((m) => m.id !== 'intro')
      .map((m) => ({ role: m.role, text: m.text }));
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    try {
      const reply = await humaiReply(history, trimmed);
      setMessages((m) => [...m, { id: `m-${Date.now()}`, role: 'model', text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          text: 'Bağışlayın, hazırda bağlantı yoxdur. Bir azdan yenidən cəhd edin.',
        },
      ]);
    } finally {
      setTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <View style={{ flex: 1, backgroundColor: Palette.bg }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingBottom: 14,
          paddingHorizontal: Space.lg,
          backgroundColor: Palette.surface,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          borderBottomLeftRadius: Radius.lg,
          borderBottomRightRadius: Radius.lg,
          borderCurve: 'continuous',
          ...Shadow.soft,
        }}>
        <LinearGradient
          colors={Gradients.ai}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 46, height: 46, borderRadius: 16, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="sparkles" set="ion" size={24} color="#fff" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={{ ...Type.h2, color: Palette.text }}>HarAI</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: Palette.low }} />
            <Text style={{ ...Type.small, color: Palette.textMuted }}>Süni intellekt köməkçi · onlayn</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: Space.lg, paddingBottom: 20, gap: 12 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          {messages.map((m) => (
            <ChatBubble key={m.id} bubble={m} />
          ))}
          {typing && <TypingBubble />}
        </ScrollView>

        {/* Suggestions */}
        {showSuggestions && (
          <Animated.View entering={FadeInUp.duration(400)} style={{ paddingHorizontal: Space.lg, paddingBottom: 8 }}>
            <Text style={{ ...Type.tiny, color: Palette.textMuted, marginBottom: 8 }}>SÜRƏTLİ SUALLAR</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {SUGGESTIONS.map((s) => (
                <Tap key={s} onPress={() => send(s)}>
                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 9,
                      borderRadius: Radius.pill,
                      backgroundColor: Palette.surface,
                      borderWidth: 1,
                      borderColor: Palette.border,
                    }}>
                    <Text style={{ ...Type.small, color: Palette.text }}>{s}</Text>
                  </View>
                </Tap>
              ))}
            </View>
          </Animated.View>
        )}

        {/* AI Smart Select shortcut */}
        {!kbVisible && (
        <View style={{ paddingHorizontal: Space.lg, paddingBottom: 8 }}>
          <Tap onPress={() => router.push({ pathname: '/report/new', params: { mode: 'ai' } })} haptic>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                alignSelf: 'flex-start',
                backgroundColor: Palette.primarySoft,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: Radius.pill,
              }}>
              <Icon name="camera" set="ion" size={15} color={Palette.primary} />
              <Text style={{ ...Type.small, color: Palette.primary }}>Şəkil çəkərək problem bildir</Text>
            </View>
          </Tap>
        </View>
        )}

        {/* Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 10,
            paddingHorizontal: Space.lg,
            paddingTop: 8,
            paddingBottom: kbVisible ? 10 : Math.max(insets.bottom, 10) + 78,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Palette.surface,
              borderRadius: Radius.lg,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: Palette.border,
              paddingHorizontal: 16,
              paddingVertical: 12,
              maxHeight: 120,
              ...Shadow.soft,
            }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Sualınızı yazın…"
              placeholderTextColor={Palette.textFaint}
              multiline
              style={{ ...Type.body, color: Palette.text }}
              onSubmitEditing={() => send(input)}
            />
          </View>
          <Pressable onPress={() => send(input)} disabled={!input.trim() || typing}>
            <LinearGradient
              colors={input.trim() && !typing ? Gradients.ai : [Palette.borderStrong, Palette.borderStrong]}
              style={{ width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', ...Shadow.soft }}>
              <Icon name="arrow-up" set="ion" size={24} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function ChatBubble({ bubble }: { bubble: Bubble }) {
  const isUser = bubble.role === 'user';
  return (
    <Animated.View
      entering={isUser ? FadeInDown.duration(300) : FadeIn.duration(350)}
      style={{ flexDirection: 'row', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
        <LinearGradient
          colors={Gradients.ai}
          style={{ width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 8, marginTop: 2 }}>
          <Icon name="sparkles" set="ion" size={15} color="#fff" />
        </LinearGradient>
      )}
      {isUser ? (
        <LinearGradient
          colors={Gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            maxWidth: '78%',
            paddingHorizontal: 16,
            paddingVertical: 11,
            borderRadius: 20,
            borderBottomRightRadius: 6,
            borderCurve: 'continuous',
          }}>
          <Text style={{ ...Type.body, color: '#fff' }}>{bubble.text}</Text>
        </LinearGradient>
      ) : (
        <View
          style={{
            maxWidth: '80%',
            backgroundColor: Palette.surface,
            paddingHorizontal: 16,
            paddingVertical: 11,
            borderRadius: 20,
            borderBottomLeftRadius: 6,
            borderCurve: 'continuous',
            ...Shadow.soft,
          }}>
          <Text style={{ ...Type.body, color: Palette.text }} selectable>
            {bubble.text}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

function TypingBubble() {
  return (
    <Animated.View entering={FadeIn} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <LinearGradient
        colors={Gradients.ai}
        style={{ width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="sparkles" set="ion" size={15} color="#fff" />
      </LinearGradient>
      <View
        style={{
          flexDirection: 'row',
          gap: 5,
          backgroundColor: Palette.surface,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderRadius: 20,
          borderBottomLeftRadius: 6,
          ...Shadow.soft,
        }}>
        {[0, 1, 2].map((i) => (
          <Dot key={i} delay={i * 160} />
        ))}
      </View>
    </Animated.View>
  );
}

function Dot({ delay }: { delay: number }) {
  const o = useSharedValue(0.3);
  useEffect(() => {
    o.value = withDelay(delay, withRepeat(withTiming(1, { duration: 450 }), -1, true));
  }, [delay, o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ scale: 0.7 + o.value * 0.5 }] }));
  return (
    <Animated.View
      style={[{ width: 7, height: 7, borderRadius: 4, backgroundColor: Palette.textFaint }, style]}
    />
  );
}
