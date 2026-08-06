import assert from 'node:assert/strict';
import test from 'node:test';
import { summarizeQuality, validateSubtitles } from '../src/index.js';

function cue(index, startMs, endMs, text = 'Readable subtitle') {
  return { index, sourceLine: index * 3 - 1, startMs, endMs, text };
}

test('returns no issues for readable sequential cues', () => {
  const cues = [cue(1, 1000, 2500), cue(2, 3000, 4500)];
  assert.deepEqual(validateSubtitles(cues), []);
  assert.deepEqual(summarizeQuality(cues, []), {
    cueCount: 2,
    errorCount: 0,
    warningCount: 0,
    issueCount: 0,
    qualityScore: 100,
  });
});

test('reports overlap as a warning without rewriting valid timing', () => {
  const cues = [cue(1, 1000, 3000), cue(2, 2700, 4500)];
  const original = structuredClone(cues);
  const issues = validateSubtitles(cues);
  assert.equal(issues.find((issue) => issue.rule === 'overlap').severity, 'warning');
  assert.deepEqual(cues, original);
});

test('reports invalid duration, reading speed, order, and media overrun', () => {
  const cues = [
    cue(1, 1000, 3000),
    cue(2, 2500, 2800, 'This cue contains far too many characters for its short duration.'),
    cue(3, 2000, 1900),
    cue(4, 9000, 11_000),
  ];
  const issues = validateSubtitles(cues, { mediaDurationMs: 10_000 });
  const rules = new Set(issues.map((issue) => issue.rule));
  assert.ok(rules.has('overlap'));
  assert.ok(rules.has('short-duration'));
  assert.ok(rules.has('high-reading-speed'));
  assert.ok(rules.has('invalid-duration'));
  assert.ok(rules.has('out-of-order'));
  assert.ok(rules.has('beyond-media-duration'));
});

test('rejects invalid rule configuration', () => {
  assert.throws(() => validateSubtitles([], { maxCharactersPerSecond: 0 }), /greater than zero/);
  assert.throws(() => validateSubtitles([], { mediaDurationMs: -1 }), /greater than zero/);
});
