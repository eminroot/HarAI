/**
 * Issue categories personalised for Nərimanov rayonu (Baku).
 * Each `service` shown to the citizen maps to one AI `categoryId` and a responsible department.
 */

export type IconSet = 'mci' | 'ion';

export type Service = {
  id: string;
  /** AI classification category this service belongs to */
  categoryId: CategoryId;
  title: string; // Azerbaijani
  subtitle: string; // short example, Azerbaijani
  icon: string;
  iconSet: IconSet;
  color: string;
};

export type CategoryId =
  | 'roads'
  | 'water'
  | 'sanitation'
  | 'greenery'
  | 'lighting'
  | 'facades'
  | 'signage'
  | 'parks'
  | 'construction'
  | 'seasonal';

export const DEPARTMENTS: Record<CategoryId, string> = {
  roads: 'Yol-Nəqliyyat İdarəsi',
  water: 'Mənzil-Kommunal Təsərrüfatı',
  sanitation: 'Təmizlik və Tullantı İdarəsi',
  greenery: 'Yaşıllaşdırma İdarəsi',
  lighting: 'İşıqlandırma Xidməti',
  facades: 'Memarlıq və Şəhərsalma İdarəsi',
  signage: 'Reklam və İnformasiya İdarəsi',
  parks: 'Abadlıq və Bağçılıq İdarəsi',
  construction: 'Tikinti Nəzarəti İdarəsi',
  seasonal: 'Kommunal Təcili Xidmət',
};

/** Azerbaijani display name per category (used by AI + cards) */
export const CATEGORY_NAMES: Record<CategoryId, string> = {
  roads: 'Yollar və Asfalt',
  water: 'Su və Subasma',
  sanitation: 'Təmizlik və Tullantılar',
  greenery: 'Yaşıllıq və Ağaclar',
  lighting: 'Küçə İşıqlandırması',
  facades: 'Bina Fasadları',
  signage: 'Reklam və Vitrinlər',
  parks: 'Parklar və Avadanlıq',
  construction: 'Tikinti Sahələri',
  seasonal: 'Buz və Mövsümi',
};

export const CATEGORY_ICON: Record<CategoryId, { icon: string; iconSet: IconSet; color: string }> = {
  roads: { icon: 'road-variant', iconSet: 'mci', color: '#3B5BDB' },
  water: { icon: 'water', iconSet: 'mci', color: '#0EA5E9' },
  sanitation: { icon: 'trash-can', iconSet: 'mci', color: '#F97316' },
  greenery: { icon: 'tree', iconSet: 'mci', color: '#16A34A' },
  lighting: { icon: 'lightbulb-on', iconSet: 'mci', color: '#F59E0B' },
  facades: { icon: 'home-city', iconSet: 'mci', color: '#8B5CF6' },
  signage: { icon: 'billboard', iconSet: 'mci', color: '#EC4899' },
  parks: { icon: 'seat-outline', iconSet: 'mci', color: '#14B8A6' },
  construction: { icon: 'excavator', iconSet: 'mci', color: '#CA8A04' },
  seasonal: { icon: 'snowflake', iconSet: 'mci', color: '#38BDF8' },
};

export type ServiceSection = { title: string; data: Service[] };

export const SERVICE_SECTIONS: ServiceSection[] = [
  {
    title: 'Yol və İnfrastruktur',
    data: [
      { id: 'roads', categoryId: 'roads', title: 'Yol və Asfalt', subtitle: 'Çuxur, dağılmış asfalt', icon: 'road-variant', iconSet: 'mci', color: '#3B5BDB' },
      { id: 'sidewalk', categoryId: 'roads', title: 'Səki və Bordür', subtitle: 'Sınıq səki, bordür', icon: 'walk', iconSet: 'ion', color: '#6366F1' },
      { id: 'water', categoryId: 'water', title: 'Subasma və Drenaj', subtitle: 'Yağışdan sonra subasma', icon: 'water', iconSet: 'mci', color: '#0EA5E9' },
      { id: 'construction', categoryId: 'construction', title: 'Tikinti Sahələri', subtitle: 'Təhlükəli hasar, qazıntı', icon: 'excavator', iconSet: 'mci', color: '#CA8A04' },
    ],
  },
  {
    title: 'Təmizlik və Ətraf Mühit',
    data: [
      { id: 'sanitation', categoryId: 'sanitation', title: 'Zibil və Tullantılar', subtitle: 'Dolu konteyner, zibillik', icon: 'trash-can', iconSet: 'mci', color: '#F97316' },
      { id: 'greenery', categoryId: 'greenery', title: 'Yaşıllıq və Ağaclar', subtitle: 'Aşmış ağac, quru yaşıllıq', icon: 'tree', iconSet: 'mci', color: '#16A34A' },
    ],
  },
  {
    title: 'İşıqlandırma və Binalar',
    data: [
      { id: 'lighting', categoryId: 'lighting', title: 'Küçə İşıqlandırması', subtitle: 'Yanmayan işıq, qaranlıq zona', icon: 'lightbulb-on', iconSet: 'mci', color: '#F59E0B' },
      { id: 'facades', categoryId: 'facades', title: 'Bina Fasadları', subtitle: 'Soyulmuş rəng, dağılan fasad', icon: 'home-city', iconSet: 'mci', color: '#8B5CF6' },
    ],
  },
  {
    title: 'Şəhər Abadlığı',
    data: [
      { id: 'signage', categoryId: 'signage', title: 'Reklam və Vitrinlər', subtitle: 'Zədəli lövhə, vitrin', icon: 'billboard', iconSet: 'mci', color: '#EC4899' },
      { id: 'parks', categoryId: 'parks', title: 'Park və Skamyalar', subtitle: 'Sınıq skamya, atraksion', icon: 'seat-outline', iconSet: 'mci', color: '#14B8A6' },
      { id: 'fountain', categoryId: 'parks', title: 'Fontanlar', subtitle: 'İşləməyən fontan', icon: 'fountain', iconSet: 'mci', color: '#06B6D4' },
      { id: 'seasonal', categoryId: 'seasonal', title: 'Buz və Qar', subtitle: 'Səkidə buzlaşma', icon: 'snowflake', iconSet: 'mci', color: '#38BDF8' },
    ],
  },
];

export const ALL_SERVICES: Service[] = SERVICE_SECTIONS.flatMap((s) => s.data);

export type Severity = 'low' | 'medium' | 'critical';

export const SEVERITY_LABEL: Record<Severity, string> = {
  low: 'Aşağı',
  medium: 'Orta',
  critical: 'Kritik',
};

export const SEVERITY_POINTS: Record<Severity, number> = {
  low: 10,
  medium: 25,
  critical: 50,
};

export type ReportStatus = 'pending' | 'approved' | 'rejected' | 'in_progress' | 'resolved';

export const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: 'Təsdiq gözləyir',
  approved: 'Təsdiqləndi',
  rejected: 'Rədd edildi',
  in_progress: 'İcrada',
  resolved: 'Həll olundu',
};

// Linear lifecycle shown in the report timeline. `rejected` is a terminal off-track
// state and is intentionally NOT part of this order (it gets its own rendering).
export const STATUS_ORDER: ReportStatus[] = ['pending', 'approved', 'in_progress', 'resolved'];
