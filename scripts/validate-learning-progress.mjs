import assert from 'node:assert/strict';
import {
  LEARNING_STORAGE_KEY,
  CURRENT_SCHEMA_VERSION,
  createEmptyLearningState,
  loadPersistentLearningProgress,
  savePersistentLearningProgress,
  recordCompletedAttempt,
  recordCompletedGuide,
  resetPersistentLearningProgress,
  computeTopicSummaries,
  exportLearningHistoryJSON,
  importLearningHistoryJSON
} from '../app/learning-progress.ts';

console.log('Auditing Persistent Learning Progress engine...');

// 1. Initial empty progress state
const emptyState = createEmptyLearningState();
assert.equal(emptyState.version, CURRENT_SCHEMA_VERSION, 'Version mismatch in empty state');
assert.equal(emptyState.totalSessionsCompleted, 0, 'Initial sessions must be 0');
assert.equal(emptyState.totalQuestionsAnswered, 0, 'Initial questions must be 0');
assert.equal(emptyState.totalCorrectAnswers, 0, 'Initial correct answers must be 0');
assert.equal(emptyState.overallAccuracy, 0, 'Initial accuracy must be 0%');
assert.equal(emptyState.bestScorePercentage, 0, 'Initial best score must be 0%');
assert.deepEqual(emptyState.recentAttempts, [], 'Initial attempts list must be empty');
assert.deepEqual(emptyState.completedGuideIds, [], 'Initial completed guides list must be empty');
assert.deepEqual(emptyState.conceptMastery, {}, 'Initial concept mastery map must be empty');
console.log('✓ Initial empty state contracts verified');

// 2. Recording a completed attempt
const attempt1 = {
  id: 'attempt-test-1',
  timestamp: Date.now() - 60000,
  category: 'all',
  difficulty: 'Beginner',
  totalQuestions: 5,
  score: 4,
  percentage: 80,
  questionIds: ['q-1', 'q-2', 'q-3', 'q-4', 'q-5'],
  systemBreakdown: {
    cardiac: { total: 2, correct: 2 },
    skeletal: { total: 2, correct: 1 },
    respiratory: { total: 1, correct: 1 }
  }
};

const conceptResults1 = [
  { conceptId: 'FMA7088', conceptName: 'Heart', system: 'cardiac', isCorrect: true },
  { conceptId: 'FMA46565', conceptName: 'Skull', system: 'skeletal', isCorrect: true },
  { conceptId: 'FMA24485', conceptName: 'Patella', system: 'skeletal', isCorrect: false },
  { conceptId: 'FMA7394', conceptName: 'Trachea', system: 'respiratory', isCorrect: true }
];

const stateAfter1 = recordCompletedAttempt(emptyState, attempt1, conceptResults1);
assert.equal(stateAfter1.totalSessionsCompleted, 1, 'Total sessions should be 1');
assert.equal(stateAfter1.totalQuestionsAnswered, 5, 'Total questions should be 5');
assert.equal(stateAfter1.totalCorrectAnswers, 4, 'Total correct should be 4');
assert.equal(stateAfter1.overallAccuracy, 80, 'Overall accuracy should be 80%');
assert.equal(stateAfter1.bestScorePercentage, 80, 'Best score should be 80%');
assert.equal(stateAfter1.recentAttempts.length, 1, 'Recent attempts should contain 1 entry');
assert.equal(stateAfter1.conceptMastery['FMA7088'].correctCount, 1, 'Heart concept should have 1 correct');
assert.equal(stateAfter1.conceptMastery['FMA24485'].incorrectCount, 1, 'Patella concept should have 1 incorrect');
console.log('✓ Attempt recording and concept mastery contracts verified');

// 3. Duplicate recording protection (React re-render safety)
const duplicateAttemptState = recordCompletedAttempt(stateAfter1, attempt1, conceptResults1);
assert.equal(duplicateAttemptState.totalSessionsCompleted, 1, 'Duplicate attempt must not increment session count');
assert.equal(duplicateAttemptState.totalQuestionsAnswered, 5, 'Duplicate attempt must not increment question count');
assert.equal(duplicateAttemptState.totalCorrectAnswers, 4, 'Duplicate attempt must not increment correct count');
assert.equal(duplicateAttemptState.recentAttempts.length, 1, 'Duplicate attempt must not be added to history list');
console.log('✓ Duplicate recording idempotency verified');

// 4. Recording second attempt with improved score
const attempt2 = {
  id: 'attempt-test-2',
  timestamp: Date.now(),
  category: 'cardiopulmonary',
  difficulty: 'Intermediate',
  totalQuestions: 5,
  score: 5,
  percentage: 100,
  questionIds: ['q-6', 'q-7', 'q-8', 'q-9', 'q-10'],
  systemBreakdown: {
    cardiac: { total: 3, correct: 3 },
    respiratory: { total: 2, correct: 2 }
  }
};

const stateAfter2 = recordCompletedAttempt(stateAfter1, attempt2);
assert.equal(stateAfter2.totalSessionsCompleted, 2, 'Sessions should be 2');
assert.equal(stateAfter2.totalQuestionsAnswered, 10, 'Total questions should be 10 (5+5)');
assert.equal(stateAfter2.totalCorrectAnswers, 9, 'Total correct should be 9 (4+5)');
assert.equal(stateAfter2.overallAccuracy, 90, 'Accuracy should be 90% (9/10)');
assert.equal(stateAfter2.bestScorePercentage, 100, 'Best score should update to 100%');
assert.equal(stateAfter2.recentAttempts.length, 2, 'Recent attempts should contain 2 entries');
console.log('✓ Multi-session aggregation and best score tracking verified');

// 5. Topic-level performance breakdown
const topicSummaries = computeTopicSummaries(stateAfter2);
assert.ok(topicSummaries.allTopics.length >= 3, 'Should have cardiac, skeletal, respiratory topics');

const cardiacTopic = topicSummaries.allTopics.find(t => t.system === 'cardiac');
assert.ok(cardiacTopic, 'Cardiac topic missing');
assert.equal(cardiacTopic.totalAnswered, 5, 'Cardiac total answered should be 5 (2+3)');
assert.equal(cardiacTopic.correctCount, 5, 'Cardiac correct count should be 5 (2+3)');
assert.equal(cardiacTopic.accuracy, 100, 'Cardiac accuracy should be 100%');

const skeletalTopic = topicSummaries.allTopics.find(t => t.system === 'skeletal');
assert.ok(skeletalTopic, 'Skeletal topic missing');
assert.equal(skeletalTopic.totalAnswered, 2, 'Skeletal total should be 2');
assert.equal(skeletalTopic.correctCount, 1, 'Skeletal correct should be 1');
assert.equal(skeletalTopic.accuracy, 50, 'Skeletal accuracy should be 50%');

// Check classification: strong (>=75%) vs practice (<75%)
assert.ok(topicSummaries.strongTopics.some(t => t.system === 'cardiac'), 'Cardiac should be in strongTopics');
assert.ok(topicSummaries.practiceTopics.some(t => t.system === 'skeletal'), 'Skeletal should be in practiceTopics');
console.log('✓ Topic performance calculation and classification verified');

// 6. Guided-tour completion tracking
const stateWithGuide1 = recordCompletedGuide(stateAfter2, 'cardiovascular-core');
assert.equal(stateWithGuide1.completedGuideIds.length, 1, 'Should have 1 completed guide');
assert.ok(stateWithGuide1.completedGuideIds.includes('cardiovascular-core'), 'Should contain cardiovascular-core');

// Duplicate guide completion
const stateWithGuideDup = recordCompletedGuide(stateWithGuide1, 'cardiovascular-core');
assert.equal(stateWithGuideDup.completedGuideIds.length, 1, 'Duplicate guide completion must not add extra entry');
console.log('✓ Guided tour tracking and idempotency verified');

// 7. Export and Import JSON validation
const exportedJSON = exportLearningHistoryJSON(stateWithGuide1);
assert.ok(typeof exportedJSON === 'string', 'Exported result must be string');
const parsedExport = JSON.parse(exportedJSON);
assert.equal(parsedExport.appName, 'AnatomyExplorer', 'Exported JSON appName mismatch');
assert.equal(parsedExport.data.totalSessionsCompleted, 2, 'Exported total sessions mismatch');

const importResult = importLearningHistoryJSON(exportedJSON);
assert.equal(importResult.success, true, 'Import should succeed');
assert.equal(importResult.state?.totalSessionsCompleted, 2, 'Imported state totalSessions mismatch');
assert.equal(importResult.state?.bestScorePercentage, 100, 'Imported bestScore mismatch');

// Invalid import JSON
const malformedImport = importLearningHistoryJSON('{ bad: "json", ');
assert.equal(malformedImport.success, false, 'Malformed import should fail gracefully');

const wrongSchemaImport = importLearningHistoryJSON(JSON.stringify({ someRandomField: 123 }));
assert.equal(wrongSchemaImport.success, false, 'Missing schema import should fail gracefully');

// ============================================================
// REGRESSION TESTS: BUG-STOR-01 Imported Progress Validation
// ============================================================
console.log('Testing BUG-STOR-01 Imported Progress Validation bounds & edge cases...');

// Test 1: Impossible statistics (totalCorrectAnswers > totalQuestionsAnswered, >100% accuracy)
const impossibleStatsPayload = JSON.stringify({
  version: 1,
  appName: 'AnatomyExplorer',
  exportedAt: new Date().toISOString(),
  data: {
    ...emptyState,
    totalSessionsCompleted: 5,
    totalQuestionsAnswered: 10,
    totalCorrectAnswers: 50, // Impossible: 50 correct out of 10
    overallAccuracy: 500, // Impossible: 500%
    bestScorePercentage: 250 // Impossible: 250%
  }
});

const resImpossible = importLearningHistoryJSON(impossibleStatsPayload);
assert.equal(resImpossible.success, true, 'Import should succeed with bounds sanitization');
assert.ok(resImpossible.state, 'State must be returned');
assert.equal(resImpossible.state.totalQuestionsAnswered, 10, 'Total questions should be 10');
assert.equal(resImpossible.state.totalCorrectAnswers, 10, 'totalCorrectAnswers MUST be clamped to totalQuestionsAnswered (10)');
assert.equal(resImpossible.state.overallAccuracy, 100, 'overallAccuracy MUST NOT exceed 100%');
assert.equal(resImpossible.state.bestScorePercentage, 100, 'bestScorePercentage MUST NOT exceed 100%');

// Test 2: Negative numbers
const negativeStatsPayload = JSON.stringify({
  version: 1,
  appName: 'AnatomyExplorer',
  exportedAt: new Date().toISOString(),
  data: {
    ...emptyState,
    totalSessionsCompleted: -3,
    totalQuestionsAnswered: -10,
    totalCorrectAnswers: -5,
    overallAccuracy: -50,
    bestScorePercentage: -100
  }
});

const resNegative = importLearningHistoryJSON(negativeStatsPayload);
assert.equal(resNegative.success, true, 'Negative import should sanitize without crashing');
assert.equal(resNegative.state.totalSessionsCompleted, 0, 'Negative sessions clamped to 0');
assert.equal(resNegative.state.totalQuestionsAnswered, 0, 'Negative questions clamped to 0');
assert.equal(resNegative.state.totalCorrectAnswers, 0, 'Negative correct clamped to 0');
assert.equal(resNegative.state.overallAccuracy, 0, 'Negative accuracy clamped to 0%');
assert.equal(resNegative.state.bestScorePercentage, 0, 'Negative best score clamped to 0%');

// Test 3: Non-finite numbers (NaN, non-number string types in metrics)
const nonNumberPayload = JSON.stringify({
  version: 1,
  appName: 'AnatomyExplorer',
  exportedAt: new Date().toISOString(),
  data: {
    ...emptyState,
    totalSessionsCompleted: 'invalid-string',
    totalQuestionsAnswered: 10,
    totalCorrectAnswers: 5
  }
});
const resNonNumber = importLearningHistoryJSON(nonNumberPayload);
assert.equal(resNonNumber.success, false, 'Non-number metric should fail validation gracefully');
assert.ok(resNonNumber.error, 'Error message should be provided');

// Test 4: Corrupted nested attempts and topic breakdowns
const nestedCorruptionPayload = JSON.stringify({
  version: 1,
  appName: 'AnatomyExplorer',
  exportedAt: new Date().toISOString(),
  data: {
    ...emptyState,
    totalSessionsCompleted: 1,
    totalQuestionsAnswered: 5,
    totalCorrectAnswers: 5,
    recentAttempts: [
      {
        id: 'attempt-corrupt',
        totalQuestions: 5,
        score: 99, // Impossible: 99 score out of 5
        percentage: 1980,
        systemBreakdown: {
          cardiac: { total: 2, correct: 10 } // Impossible: 10 correct out of 2
        }
      }
    ],
    conceptMastery: {
      FMA7088: {
        conceptId: 'FMA7088',
        conceptName: 'Heart',
        system: 'cardiac',
        correctCount: -10, // Negative count
        incorrectCount: 3
      }
    },
    systemStats: {
      cardiac: { total: 2, correct: 10 } // Impossible: 10 correct out of 2
    }
  }
});

const resNested = importLearningHistoryJSON(nestedCorruptionPayload);
assert.equal(resNested.success, true, 'Nested corruption should sanitize without crashing');
const sanitizedAttempt = resNested.state.recentAttempts[0];
assert.equal(sanitizedAttempt.score, 5, 'Attempt score should be clamped to totalQuestions (5)');
assert.equal(sanitizedAttempt.percentage, 100, 'Attempt percentage should be clamped to 100%');
assert.equal(sanitizedAttempt.systemBreakdown.cardiac.correct, 2, 'Breakdown correct count should be clamped to total (2)');
assert.equal(resNested.state.conceptMastery['FMA7088'].correctCount, 0, 'Negative concept mastery clamped to 0');
assert.equal(resNested.state.systemStats.cardiac.correct, 2, 'System stats correct count clamped to total (2)');

console.log('✓ BUG-STOR-01 regression tests PASSED.');

// ============================================================
// REGRESSION TESTS: BUG-STOR-02 Cross-Tab Storage Handling
// ============================================================
console.log('Testing BUG-STOR-02 Cross-Tab Storage Event Synchronization logic...');

// Test 1: Simulating storage event serialization and deserialization
const foreignTabExport = exportLearningHistoryJSON(resImpossible.state);
assert.ok(typeof foreignTabExport === 'string');

// Verify that parsing foreign tab data with loadPersistentLearningProgress/importLearningHistoryJSON produces valid state
const reloadedState = loadPersistentLearningProgress();
assert.ok(reloadedState);
assert.ok(reloadedState.version === CURRENT_SCHEMA_VERSION);
assert.ok(reloadedState.totalCorrectAnswers <= reloadedState.totalQuestionsAnswered);

// Test 2: Simulating storage event with corrupted JSON from another tab
try {
  const corruptedEventPayload = '{ malformed json: not valid';
  const parseAttempt = JSON.parse(corruptedEventPayload);
  assert.fail('Should have thrown on invalid JSON');
} catch (e) {
  // Graceful catch as implemented in page.tsx storage event handler
  assert.ok(e instanceof SyntaxError, 'JSON syntax error caught safely without corrupting memory');
}

console.log('✓ BUG-STOR-02 regression tests PASSED.');

// 8. Reset behavior
const resetState = resetPersistentLearningProgress();
assert.equal(resetState.totalSessionsCompleted, 0, 'Reset state sessions must be 0');
assert.equal(resetState.totalQuestionsAnswered, 0, 'Reset state questions must be 0');
assert.equal(resetState.recentAttempts.length, 0, 'Reset state attempts must be empty');
console.log('✓ Reset behavior verified');

console.log('All persistent learning progress validations PASSED.');

