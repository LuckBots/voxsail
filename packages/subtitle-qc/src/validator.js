import { visibleCharacterCount } from './parser.js';

export const DEFAULT_RULES = Object.freeze({
  minDurationMs: 800,
  maxCharactersPerSecond: 20,
  mediaDurationMs: null,
});

function createIssue(cue, severity, rule, message, details = {}) {
  return {
    severity,
    rule,
    cue: cue.index,
    sourceLine: cue.sourceLine,
    startMs: cue.startMs,
    endMs: cue.endMs,
    message,
    ...details,
  };
}

function normalizeRules(options) {
  const rules = { ...DEFAULT_RULES, ...options };
  if (!Number.isFinite(rules.minDurationMs) || rules.minDurationMs < 0) {
    throw new TypeError('minDurationMs must be a non-negative number');
  }
  if (!Number.isFinite(rules.maxCharactersPerSecond) || rules.maxCharactersPerSecond <= 0) {
    throw new TypeError('maxCharactersPerSecond must be greater than zero');
  }
  if (rules.mediaDurationMs !== null && (!Number.isFinite(rules.mediaDurationMs) || rules.mediaDurationMs <= 0)) {
    throw new TypeError('mediaDurationMs must be null or greater than zero');
  }
  return rules;
}

export function validateSubtitles(cues, options = {}) {
  if (!Array.isArray(cues)) throw new TypeError('cues must be an array');
  const rules = normalizeRules(options);
  const issues = [];

  for (let index = 0; index < cues.length; index += 1) {
    const cue = cues[index];
    const previousCue = cues[index - 1];
    const durationMs = cue.endMs - cue.startMs;

    if (cue.text.trim() === '') {
      issues.push(createIssue(cue, 'error', 'empty-text', 'Cue has no visible subtitle text.'));
    }

    if (durationMs <= 0) {
      issues.push(createIssue(
        cue,
        'error',
        'invalid-duration',
        'Cue end time must be later than its start time.',
        { actualDurationMs: durationMs },
      ));
    } else {
      if (durationMs < rules.minDurationMs) {
        issues.push(createIssue(
          cue,
          'warning',
          'short-duration',
          `Cue duration is shorter than ${rules.minDurationMs}ms.`,
          { actualDurationMs: durationMs, thresholdMs: rules.minDurationMs },
        ));
      }

      const characterCount = visibleCharacterCount(cue.text);
      const charactersPerSecond = characterCount / (durationMs / 1000);
      if (charactersPerSecond > rules.maxCharactersPerSecond) {
        issues.push(createIssue(
          cue,
          'warning',
          'high-reading-speed',
          `Reading speed exceeds ${rules.maxCharactersPerSecond} characters per second.`,
          {
            characterCount,
            charactersPerSecond: Number(charactersPerSecond.toFixed(2)),
            threshold: rules.maxCharactersPerSecond,
          },
        ));
      }
    }

    if (rules.mediaDurationMs !== null && cue.endMs > rules.mediaDurationMs) {
      issues.push(createIssue(
        cue,
        'error',
        'beyond-media-duration',
        'Cue extends beyond the configured media duration.',
        { mediaDurationMs: rules.mediaDurationMs },
      ));
    }

    if (previousCue) {
      if (cue.startMs < previousCue.startMs) {
        issues.push(createIssue(
          cue,
          'error',
          'out-of-order',
          `Cue starts before cue ${previousCue.index}.`,
          { previousCue: previousCue.index },
        ));
      }

      if (previousCue.endMs > previousCue.startMs && cue.startMs < previousCue.endMs) {
        // Subtitle overlaps can be intentional (for example, multiple speakers), so report rather than mutate.
        issues.push(createIssue(
          cue,
          'warning',
          'overlap',
          `Cue overlaps cue ${previousCue.index}. Review whether the overlap is intentional.`,
          { previousCue: previousCue.index, overlapMs: previousCue.endMs - cue.startMs },
        ));
      }
    }
  }

  return issues;
}

export function summarizeQuality(cues, issues) {
  const errorCount = issues.filter((issue) => issue.severity === 'error').length;
  const warningCount = issues.filter((issue) => issue.severity === 'warning').length;
  return {
    cueCount: cues.length,
    errorCount,
    warningCount,
    issueCount: issues.length,
    qualityScore: Math.max(0, 100 - (errorCount * 10) - (warningCount * 3)),
  };
}
