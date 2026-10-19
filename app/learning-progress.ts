/**
 * AnatomyExplorer - Persistent Learning Progress & Analytics Engine
 *
 * Implements versioned local persistence, safe error handling,
 * idempotent session recording, topic performance aggregation,
 * and data import/export for interactive learning progress.
 */

export const LEARNING_STORAGE_KEY = 'anatomy-explorer-learning-v1';
export const CURRENT_SCHEMA_VERSION = 1;
export const MAX_RECENT_ATTEMPTS = 30;

export interface SystemScoreBreakdown {
  total: number;
  correct: number;
}

export interface QuizAttemptRecord {
  id: string;
  timestamp: number;
  category: string;
  difficulty: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  questionIds: string[];
  systemBreakdown: Record<string, SystemScoreBreakdown>;
}

export interface ConceptMasteryRecord {
  conceptId: string;
  conceptName: string;
  system: string;
  correctCount: number;
  incorrectCount: number;
  lastAttemptTimestamp: number;
}

export interface TopicStats {
  system: string;
  systemName: string;
  totalAnswered: number;
  correctCount: number;
  accuracy: number; // 0 to 100
}

export interface PersistentLearningState {
  version: number;
  totalSessionsCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number; // 0 to 100
  bestScorePercentage: number;
  bestScoreDetail?: {
    score: number;
    total: number;
    percentage: number;
    category: string;
    timestamp: number;
  };
  recentAttempts: QuizAttemptRecord[];
  completedGuideIds: string[];
  conceptMastery: Record<string, ConceptMasteryRecord>;
  systemStats: Record<string, SystemScoreBreakdown>;
  recordedAttemptIds: string[];
  lastActiveTimestamp?: number;
}

export const SYSTEM_DISPLAY_NAMES: Record<string, string> = {
  cardiac: 'Cardiovascular',
  respiratory: 'Respiratory',
  skeletal: 'Skeletal Framework',
  muscular: 'Muscular System',
  digestive: 'Digestive System',
  urinary: 'Urinary Tract',
  nervous: 'Nervous System',
  arterial: 'Arterial Vasculature',
  venous: 'Venous Vasculature',
  lymphatic: 'Lymphatic Network',
  endocrine: 'Endocrine System',
  sensory: 'Sensory Apparatus',
  integumentary: 'Integumentary System',
  reproductive: 'Reproductive Anatomy',
  connective: 'Connective Tissue'
};

export const SYSTEM_TO_CATEGORY_MAP: Record<string, 'all' | 'skeletal' | 'cardiopulmonary' | 'visceral' | 'neuro'> = {
  cardiac: 'cardiopulmonary',
  respiratory: 'cardiopulmonary',
  muscular: 'cardiopulmonary',
  skeletal: 'skeletal',
  digestive: 'visceral',
  urinary: 'visceral',
  nervous: 'neuro'
};

export const SYSTEM_TO_GUIDE_MAP: Record<string, { guideId: string; title: string }> = {
  cardiac: { guideId: 'cardiovascular-core', title: 'Cardiovascular Essentials' },
  skeletal: { guideId: 'skeletal-core', title: 'Core Skeletal Framework' },
  respiratory: { guideId: 'respiratory-core', title: 'Respiratory Pathway' }
};

/**
 * Creates a clean default learning state
 */
export function createEmptyLearningState(): PersistentLearningState {
  return {
    version: CURRENT_SCHEMA_VERSION,
    totalSessionsCompleted: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    overallAccuracy: 0,
    bestScorePercentage: 0,
    recentAttempts: [],
    completedGuideIds: [],
    conceptMastery: {},
    systemStats: {},
    recordedAttemptIds: []
  };
}

// In-memory fallback if localStorage is disabled or restricted
let memoryStore: Record<string, string> = {};

export function getSafeLocalStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const probe = '__probe_test__';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      return window.localStorage;
    }
  } catch {
    // LocalStorage blocked, disabled, or QuotaExceeded
  }
  return null;
}

/**
 * Loads persistent learning progress from localStorage with full error safety
 */
export function loadPersistentLearningProgress(): PersistentLearningState {
  const empty = createEmptyLearningState();
  const storage = getSafeLocalStorage();

  let raw: string | null = null;
  try {
    if (storage) {
      raw = storage.getItem(LEARNING_STORAGE_KEY);
    } else {
      raw = memoryStore[LEARNING_STORAGE_KEY] ?? null;
    }
  } catch (e) {
    console.warn('[LearningProgress] Failed to read from storage:', e);
    return empty;
  }

  if (!raw) {
    return empty;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return empty;
    }

    // Version safety check
    if (typeof parsed.version !== 'number' || parsed.version < 1) {
      console.warn('[LearningProgress] Unsupported or missing schema version. Initializing default state.');
      return empty;
    }

    // Validate and sanitize numeric counts
    const totalSessions = Math.max(0, Number(parsed.totalSessionsCompleted) || 0);
    const totalQuestions = Math.max(0, Number(parsed.totalQuestionsAnswered) || 0);
    const totalCorrect = Math.max(0, Math.min(totalQuestions, Number(parsed.totalCorrectAnswers) || 0));
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const bestScore = Math.max(0, Math.min(100, Number(parsed.bestScorePercentage) || 0));

    const recentAttempts: QuizAttemptRecord[] = Array.isArray(parsed.recentAttempts)
      ? parsed.recentAttempts
          .filter((a: any) => a && typeof a === 'object' && typeof a.id === 'string')
          .slice(0, MAX_RECENT_ATTEMPTS)
      : [];

    const completedGuideIds: string[] = Array.isArray(parsed.completedGuideIds)
      ? parsed.completedGuideIds.filter((id: any) => typeof id === 'string')
      : [];

    const conceptMastery: Record<string, ConceptMasteryRecord> =
      parsed.conceptMastery && typeof parsed.conceptMastery === 'object' ? parsed.conceptMastery : {};

    const systemStats: Record<string, SystemScoreBreakdown> =
      parsed.systemStats && typeof parsed.systemStats === 'object' ? parsed.systemStats : {};

    const recordedAttemptIds: string[] = Array.isArray(parsed.recordedAttemptIds)
      ? parsed.recordedAttemptIds.filter((id: any) => typeof id === 'string')
      : recentAttempts.map(a => a.id);

    return {
      version: CURRENT_SCHEMA_VERSION,
      totalSessionsCompleted: totalSessions,
      totalQuestionsAnswered: totalQuestions,
      totalCorrectAnswers: totalCorrect,
      overallAccuracy: accuracy,
      bestScorePercentage: bestScore,
      bestScoreDetail: parsed.bestScoreDetail,
      recentAttempts,
      completedGuideIds,
      conceptMastery,
      systemStats,
      recordedAttemptIds,
      lastActiveTimestamp: parsed.lastActiveTimestamp
    };
  } catch (err) {
    console.warn('[LearningProgress] Failed to parse learning progress JSON. Reverting to empty state:', err);
    return empty;
  }
}

/**
 * Saves learning state to localStorage with quota overflow handling
 */
export function savePersistentLearningProgress(state: PersistentLearningState): boolean {
  const storage = getSafeLocalStorage();
  const serialized = JSON.stringify(state);

  try {
    if (storage) {
      storage.setItem(LEARNING_STORAGE_KEY, serialized);
    } else {
      memoryStore[LEARNING_STORAGE_KEY] = serialized;
    }
    return true;
  } catch (err) {
    console.warn('[LearningProgress] Error saving to storage (attempting recovery):', err);
    // If quota exceeded, prune older attempts and retry once
    try {
      if (state.recentAttempts.length > 5) {
        const prunedState: PersistentLearningState = {
          ...state,
          recentAttempts: state.recentAttempts.slice(0, 5),
          recordedAttemptIds: state.recordedAttemptIds.slice(-10)
        };
        const prunedSerialized = JSON.stringify(prunedState);
        if (storage) {
          storage.setItem(LEARNING_STORAGE_KEY, prunedSerialized);
        } else {
          memoryStore[LEARNING_STORAGE_KEY] = prunedSerialized;
        }
        return true;
      }
    } catch {
      // In-memory fallback
      memoryStore[LEARNING_STORAGE_KEY] = serialized;
    }
    return false;
  }
}

/**
 * Idempotently records a finished quiz session
 */
export function recordCompletedAttempt(
  currentState: PersistentLearningState,
  attempt: QuizAttemptRecord,
  conceptResults?: { conceptId: string; conceptName: string; system: string; isCorrect: boolean }[]
): PersistentLearningState {
  // Idempotency check: prevent duplicate saves caused by React re-renders
  if (currentState.recordedAttemptIds.includes(attempt.id)) {
    return currentState;
  }

  const newTotalSessions = currentState.totalSessionsCompleted + 1;
  const newTotalQuestions = currentState.totalQuestionsAnswered + attempt.totalQuestions;
  const newTotalCorrect = currentState.totalCorrectAnswers + attempt.score;
  const newAccuracy = newTotalQuestions > 0 ? Math.round((newTotalCorrect / newTotalQuestions) * 100) : 0;
  const isNewBest = attempt.percentage >= currentState.bestScorePercentage;
  const newBestPercentage = Math.max(currentState.bestScorePercentage, attempt.percentage);

  const newBestDetail = isNewBest
    ? {
        score: attempt.score,
        total: attempt.totalQuestions,
        percentage: attempt.percentage,
        category: attempt.category,
        timestamp: attempt.timestamp
      }
    : currentState.bestScoreDetail;

  // Update system stats
  const nextSystemStats: Record<string, SystemScoreBreakdown> = { ...currentState.systemStats };
  for (const [sys, bd] of Object.entries(attempt.systemBreakdown)) {
    const existing = nextSystemStats[sys] ?? { total: 0, correct: 0 };
    nextSystemStats[sys] = {
      total: existing.total + bd.total,
      correct: existing.correct + bd.correct
    };
  }

  // Update concept mastery
  const nextConceptMastery: Record<string, ConceptMasteryRecord> = { ...currentState.conceptMastery };
  if (conceptResults) {
    for (const res of conceptResults) {
      const existing = nextConceptMastery[res.conceptId] ?? {
        conceptId: res.conceptId,
        conceptName: res.conceptName,
        system: res.system,
        correctCount: 0,
        incorrectCount: 0,
        lastAttemptTimestamp: attempt.timestamp
      };
      nextConceptMastery[res.conceptId] = {
        ...existing,
        correctCount: existing.correctCount + (res.isCorrect ? 1 : 0),
        incorrectCount: existing.incorrectCount + (res.isCorrect ? 0 : 1),
        lastAttemptTimestamp: attempt.timestamp
      };
    }
  }

  const nextRecent = [attempt, ...currentState.recentAttempts].slice(0, MAX_RECENT_ATTEMPTS);
  const nextRecordedIds = [attempt.id, ...currentState.recordedAttemptIds].slice(0, 100);

  const updatedState: PersistentLearningState = {
    ...currentState,
    totalSessionsCompleted: newTotalSessions,
    totalQuestionsAnswered: newTotalQuestions,
    totalCorrectAnswers: newTotalCorrect,
    overallAccuracy: newAccuracy,
    bestScorePercentage: newBestPercentage,
    bestScoreDetail: newBestDetail,
    recentAttempts: nextRecent,
    recordedAttemptIds: nextRecordedIds,
    systemStats: nextSystemStats,
    conceptMastery: nextConceptMastery,
    lastActiveTimestamp: attempt.timestamp
  };

  savePersistentLearningProgress(updatedState);
  return updatedState;
}

/**
 * Records completion of a guided anatomical exploration
 */
export function recordCompletedGuide(
  currentState: PersistentLearningState,
  guideId: string
): PersistentLearningState {
  if (currentState.completedGuideIds.includes(guideId)) {
    return currentState;
  }

  const updatedState: PersistentLearningState = {
    ...currentState,
    completedGuideIds: [...currentState.completedGuideIds, guideId],
    lastActiveTimestamp: Date.now()
  };

  savePersistentLearningProgress(updatedState);
  return updatedState;
}

/**
 * Resets learning progress after confirmation without affecting other application state
 */
export function resetPersistentLearningProgress(): PersistentLearningState {
  const empty = createEmptyLearningState();
  const storage = getSafeLocalStorage();

  try {
    if (storage) {
      storage.removeItem(LEARNING_STORAGE_KEY);
    }
    delete memoryStore[LEARNING_STORAGE_KEY];
  } catch (e) {
    console.warn('[LearningProgress] Error resetting learning progress:', e);
  }

  return empty;
}

/**
 * Computes topic-level performance metrics, distinguishing strong topics from those needing practice
 */
export function computeTopicSummaries(state: PersistentLearningState): {
  allTopics: TopicStats[];
  strongTopics: TopicStats[];
  practiceTopics: TopicStats[];
} {
  const allTopics: TopicStats[] = [];

  for (const [sys, bd] of Object.entries(state.systemStats)) {
    if (bd.total > 0) {
      const accuracy = Math.round((bd.correct / bd.total) * 100);
      allTopics.push({
        system: sys,
        systemName: SYSTEM_DISPLAY_NAMES[sys] ?? sys,
        totalAnswered: bd.total,
        correctCount: bd.correct,
        accuracy
      });
    }
  }

  // Sort by total answered descending, then accuracy descending
  allTopics.sort((a, b) => b.totalAnswered - a.totalAnswered || b.accuracy - a.accuracy);

  // Strong: >= 75% accuracy
  const strongTopics = allTopics.filter(t => t.accuracy >= 75 && t.totalAnswered >= 1);
  // Practice needed: < 75% accuracy
  const practiceTopics = allTopics.filter(t => t.accuracy < 75 && t.totalAnswered >= 1);

  return { allTopics, strongTopics, practiceTopics };
}

/**
 * Serializes learning progress into downloadable JSON format
 */
export function exportLearningHistoryJSON(state: PersistentLearningState): string {
  const exportPayload = {
    appName: 'AnatomyExplorer',
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    data: state
  };
  return JSON.stringify(exportPayload, null, 2);
}

function isSafeFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v) && !Number.isNaN(v);
}

/**
 * Validates and imports a learning history JSON payload with strict bounds safety
 */
export function importLearningHistoryJSON(
  jsonStr: string
): { success: boolean; state?: PersistentLearningState; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'File content is not a valid JSON object.' };
    }

    const payload = parsed.data ?? parsed;
    if (!payload || typeof payload !== 'object') {
      return { success: false, error: 'Missing learning progress payload in import file.' };
    }

    if (!isSafeFiniteNumber(payload.version) || payload.version < 1) {
      return { success: false, error: 'Missing or invalid schema version in import file.' };
    }

    if (
      !isSafeFiniteNumber(payload.totalSessionsCompleted) ||
      !isSafeFiniteNumber(payload.totalQuestionsAnswered) ||
      !isSafeFiniteNumber(payload.totalCorrectAnswers)
    ) {
      return { success: false, error: 'Malformed learning metrics in import payload.' };
    }

    // Sanitize and enforce numeric invariants:
    // 1. All counts must be non-negative integers
    // 2. totalCorrectAnswers CANNOT exceed totalQuestionsAnswered
    // 3. accuracy must be bounded in [0, 100]
    const totalSessions = Math.max(0, Math.floor(payload.totalSessionsCompleted));
    const totalQuestions = Math.max(0, Math.floor(payload.totalQuestionsAnswered));
    const rawCorrect = Math.max(0, Math.floor(payload.totalCorrectAnswers));
    const totalCorrect = Math.min(totalQuestions, rawCorrect); // Enforce correct <= questions answered
    const overallAccuracy =
      totalQuestions > 0 ? Math.min(100, Math.max(0, Math.round((totalCorrect / totalQuestions) * 100))) : 0;

    const rawBest = isSafeFiniteNumber(payload.bestScorePercentage) ? payload.bestScorePercentage : 0;
    const bestScorePercentage = Math.max(0, Math.min(100, Math.round(rawBest)));

    let bestScoreDetail = undefined;
    if (payload.bestScoreDetail && typeof payload.bestScoreDetail === 'object') {
      const b = payload.bestScoreDetail;
      const bTotal = isSafeFiniteNumber(b.total) ? Math.max(0, Math.floor(b.total)) : 0;
      const bScore = isSafeFiniteNumber(b.score) ? Math.max(0, Math.min(bTotal, Math.floor(b.score))) : 0;
      const bPct = bTotal > 0 ? Math.min(100, Math.max(0, Math.round((bScore / bTotal) * 100))) : 0;
      bestScoreDetail = {
        score: bScore,
        total: bTotal,
        percentage: isSafeFiniteNumber(b.percentage) ? Math.max(0, Math.min(100, Math.round(b.percentage))) : bPct,
        category: typeof b.category === 'string' ? b.category : 'all',
        timestamp: isSafeFiniteNumber(b.timestamp) ? b.timestamp : Date.now()
      };
    }

    // Sanitize recent attempts array
    const recentAttempts: QuizAttemptRecord[] = [];
    if (Array.isArray(payload.recentAttempts)) {
      for (const a of payload.recentAttempts) {
        if (!a || typeof a !== 'object' || typeof a.id !== 'string') continue;
        const aTotal = isSafeFiniteNumber(a.totalQuestions) ? Math.max(0, Math.floor(a.totalQuestions)) : 0;
        const aScore = isSafeFiniteNumber(a.score) ? Math.max(0, Math.min(aTotal, Math.floor(a.score))) : 0;
        const aPct = aTotal > 0 ? Math.min(100, Math.max(0, Math.round((aScore / aTotal) * 100))) : 0;
        const sanitizedBreakdown: Record<string, SystemScoreBreakdown> = {};
        if (a.systemBreakdown && typeof a.systemBreakdown === 'object') {
          for (const [sys, bd] of Object.entries(a.systemBreakdown)) {
            if (bd && typeof bd === 'object') {
              const bTotal = isSafeFiniteNumber((bd as any).total) ? Math.max(0, Math.floor((bd as any).total)) : 0;
              const bCorrect = isSafeFiniteNumber((bd as any).correct) ? Math.max(0, Math.min(bTotal, Math.floor((bd as any).correct))) : 0;
              sanitizedBreakdown[sys] = { total: bTotal, correct: bCorrect };
            }
          }
        }
        recentAttempts.push({
          id: a.id,
          timestamp: isSafeFiniteNumber(a.timestamp) ? a.timestamp : Date.now(),
          category: typeof a.category === 'string' ? a.category : 'all',
          difficulty: typeof a.difficulty === 'string' ? a.difficulty : 'all',
          totalQuestions: aTotal,
          score: aScore,
          percentage: isSafeFiniteNumber(a.percentage) ? Math.max(0, Math.min(100, Math.round(a.percentage))) : aPct,
          questionIds: Array.isArray(a.questionIds) ? a.questionIds.filter((qid: any) => typeof qid === 'string') : [],
          systemBreakdown: sanitizedBreakdown
        });
        if (recentAttempts.length >= MAX_RECENT_ATTEMPTS) break;
      }
    }

    // Sanitize completedGuideIds
    const completedGuideIds: string[] = Array.isArray(payload.completedGuideIds)
      ? Array.from(new Set<string>(payload.completedGuideIds.filter((id: unknown): id is string => typeof id === 'string' && id.trim().length > 0)))
      : [];

    // Sanitize conceptMastery
    const conceptMastery: Record<string, ConceptMasteryRecord> = {};
    if (payload.conceptMastery && typeof payload.conceptMastery === 'object') {
      for (const [cid, cm] of Object.entries(payload.conceptMastery)) {
        if (cm && typeof cm === 'object') {
          const rec = cm as any;
          conceptMastery[cid] = {
            conceptId: typeof rec.conceptId === 'string' ? rec.conceptId : cid,
            conceptName: typeof rec.conceptName === 'string' ? rec.conceptName : cid,
            system: typeof rec.system === 'string' ? rec.system : 'other',
            correctCount: isSafeFiniteNumber(rec.correctCount) ? Math.max(0, Math.floor(rec.correctCount)) : 0,
            incorrectCount: isSafeFiniteNumber(rec.incorrectCount) ? Math.max(0, Math.floor(rec.incorrectCount)) : 0,
            lastAttemptTimestamp: isSafeFiniteNumber(rec.lastAttemptTimestamp) ? rec.lastAttemptTimestamp : Date.now()
          };
        }
      }
    }

    // Sanitize systemStats
    const systemStats: Record<string, SystemScoreBreakdown> = {};
    if (payload.systemStats && typeof payload.systemStats === 'object') {
      for (const [sys, bd] of Object.entries(payload.systemStats)) {
        if (bd && typeof bd === 'object') {
          const sTotal = isSafeFiniteNumber((bd as any).total) ? Math.max(0, Math.floor((bd as any).total)) : 0;
          const sCorrect = isSafeFiniteNumber((bd as any).correct) ? Math.max(0, Math.min(sTotal, Math.floor((bd as any).correct))) : 0;
          systemStats[sys] = { total: sTotal, correct: sCorrect };
        }
      }
    }

    // Sanitize recordedAttemptIds
    const recordedAttemptIds: string[] = Array.isArray(payload.recordedAttemptIds)
      ? Array.from(new Set<string>(payload.recordedAttemptIds.filter((id: unknown): id is string => typeof id === 'string' && id.trim().length > 0)))
      : recentAttempts.map(a => a.id);

    const sanitized: PersistentLearningState = {
      version: CURRENT_SCHEMA_VERSION,
      totalSessionsCompleted: totalSessions,
      totalQuestionsAnswered: totalQuestions,
      totalCorrectAnswers: totalCorrect,
      overallAccuracy,
      bestScorePercentage,
      bestScoreDetail,
      recentAttempts,
      completedGuideIds,
      conceptMastery,
      systemStats,
      recordedAttemptIds,
      lastActiveTimestamp: isSafeFiniteNumber(payload.lastActiveTimestamp) ? payload.lastActiveTimestamp : Date.now()
    };

    savePersistentLearningProgress(sanitized);
    return { success: true, state: sanitized };
  } catch (e: any) {
    return { success: false, error: `Invalid JSON syntax: ${e.message}` };
  }
}
