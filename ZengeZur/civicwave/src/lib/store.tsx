import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CategoryId,
  ReportStatus,
  SEVERITY_POINTS,
  Severity,
} from '@/constants/categories';
import { subscribeReportStatuses } from '@/lib/firebase';

export type Report = {
  id: string;
  /** Key of this report under /reports in Firebase (set once the upload succeeds). */
  firebaseId?: string;
  categoryId: CategoryId;
  categoryName: string;
  title: string;
  severity: Severity;
  status: ReportStatus;
  department: string;
  costMin: number;
  costMax: number;
  confidence: number;
  note?: string;
  photoUri?: string;
  address: string;
  lat: number;
  lng: number;
  createdAt: number;
  points: number;
  firstReporter?: boolean;
};

const STORAGE_KEY = 'civicwave.reports.v1';

// Nərimanov rough centre
export const NARIMANOV = { lat: 40.4093, lng: 49.8671 };

const SEED: Report[] = [
  {
    id: 'seed-1',
    categoryId: 'roads',
    categoryName: 'Yollar və Asfalt',
    title: 'Yolda dərin çuxur',
    severity: 'critical',
    status: 'in_progress',
    department: 'Yol-Nəqliyyat İdarəsi',
    costMin: 400,
    costMax: 900,
    confidence: 94,
    address: 'Təbriz küç. 21',
    lat: 40.4051,
    lng: 49.8602,
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
    points: 50,
    firstReporter: true,
  },
  {
    id: 'seed-2',
    categoryId: 'lighting',
    categoryName: 'Küçə İşıqlandırması',
    title: 'Yanmayan küçə lampası',
    severity: 'medium',
    status: 'approved',
    department: 'İşıqlandırma Xidməti',
    costMin: 80,
    costMax: 150,
    confidence: 88,
    address: 'Ə. Əlizadə küç. 7',
    lat: 40.4128,
    lng: 49.8705,
    createdAt: Date.now() - 1000 * 60 * 60 * 9,
    points: 25,
  },
  {
    id: 'seed-3',
    categoryId: 'sanitation',
    categoryName: 'Təmizlik və Tullantılar',
    title: 'Daşmış zibil konteyneri',
    severity: 'medium',
    status: 'resolved',
    department: 'Təmizlik və Tullantı İdarəsi',
    costMin: 30,
    costMax: 60,
    confidence: 91,
    address: 'Atatürk pr. 44',
    lat: 40.4015,
    lng: 49.8748,
    createdAt: Date.now() - 1000 * 60 * 60 * 50,
    points: 25,
  },
  {
    id: 'seed-4',
    categoryId: 'greenery',
    categoryName: 'Yaşıllıq və Ağaclar',
    title: 'Aşma təhlükəsi olan ağac',
    severity: 'critical',
    status: 'pending',
    department: 'Yaşıllaşdırma İdarəsi',
    costMin: 150,
    costMax: 350,
    confidence: 79,
    address: 'Həsən bəy Zərdabi pr. 90',
    lat: 40.4162,
    lng: 49.8585,
    createdAt: Date.now() - 1000 * 60 * 30,
    points: 0,
  },
];

type Ctx = {
  reports: Report[]; // user reports
  allReports: Report[]; // user + seed (for map)
  totalPoints: number;
  rank: number;
  addReport: (r: Omit<Report, 'id' | 'createdAt' | 'status' | 'points'>) => Report;
  /** Links a local report to its Firebase /reports/<id> key so we can track its status. */
  setFirebaseId: (localId: string, firebaseId: string) => void;
  ready: boolean;
};

const ReportsContext = createContext<Ctx | null>(null);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setReports(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback((next: Report[]) => {
    setReports(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const addReport = useCallback<Ctx['addReport']>(
    (r) => {
      const report: Report = {
        ...r,
        id: `r-${Date.now()}`,
        createdAt: Date.now(),
        status: 'pending',
        points: 0, // points granted on approval (BRD BR-1)
      };
      persist([report, ...reports]);
      return report;
    },
    [reports, persist]
  );

  const setFirebaseId = useCallback<Ctx['setFirebaseId']>((localId, firebaseId) => {
    setReports((prev) => {
      const next = prev.map((r) => (r.id === localId ? { ...r, firebaseId } : r));
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  // Listen for the officer's decision in the Realtime Database and reflect it on the
  // matching local report. The dashboard is the source of truth for `status`; we only read.
  useEffect(() => {
    const unsubscribe = subscribeReportStatuses((statusById) => {
      setReports((prev) => {
        let changed = false;
        const next = prev.map((r) => {
          const remote = r.firebaseId ? statusById[r.firebaseId] : undefined;
          if (remote && remote !== r.status) {
            changed = true;
            return { ...r, status: remote };
          }
          return r;
        });
        if (changed) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return changed ? next : prev;
      });
    });
    return unsubscribe;
  }, []);

  const value = useMemo<Ctx>(() => {
    const allReports = [...reports, ...SEED];
    // base points so the leaderboard feels alive; only approved/in-progress/resolved
    // count — pending isn't earned yet and rejected never earns.
    const earned = reports
      .filter((r) => r.status === 'approved' || r.status === 'in_progress' || r.status === 'resolved')
      .reduce((s, r) => s + (SEVERITY_POINTS[r.severity] || 0), 0);
    const totalPoints = 320 + earned;
    return {
      reports,
      allReports,
      totalPoints,
      rank: 7,
      addReport,
      setFirebaseId,
      ready,
    };
  }, [reports, addReport, setFirebaseId, ready]);

  return <ReportsContext value={value}>{children}</ReportsContext>;
}

export function useReports(): Ctx {
  const ctx = use(ReportsContext);
  if (!ctx) throw new Error('useReports must be used within ReportsProvider');
  return ctx;
}
