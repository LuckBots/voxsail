import assert from 'node:assert/strict';
import test from 'node:test';
import { parseSubtitle, parseTimestamp, SubtitleParseError, visibleCharacterCount } from '../src/index.js';

test('parses SRT cues with comma timestamps', () => {
  const result = parseSubtitle(`1\n00:00:01,000 --> 00:00:02,500\nHello world\n\n2\n00:00:03,000 --> 00:00:04,000\nSecond cue\n`);
  assert.equal(result.format, 'srt');
  assert.deepEqual(result.cues[0], {
    index: 1,
    sourceLine: 2,
    startMs: 1000,
    endMs: 2500,
    text: 'Hello world',
  });
  assert.equal(result.cues[1].text, 'Second cue');
});

test('parses WebVTT timestamps, cue settings, and ignores NOTE blocks', () => {
  const result = parseSubtitle(`WEBVTT\n\nNOTE internal comment --> ignored\nmore notes\n\nintro\n00:01.000 --> 00:03.500 align:start\n<v Speaker>Hello</v>\n`);
  assert.equal(result.format, 'vtt');
  assert.equal(result.cues.length, 1);
  assert.equal(result.cues[0].startMs, 1000);
  assert.equal(result.cues[0].endMs, 3500);
});

test('rejects malformed timestamps with a useful line number', () => {
  assert.throws(
    () => parseSubtitle(`1\nnot-a-time --> 00:00:02,000\nBroken\n`),
    (error) => error instanceof SubtitleParseError && error.lineNumber === 2,
  );
});

test('counts visible Unicode characters without markup or whitespace', () => {
  assert.equal(visibleCharacterCount('<b>你好</b> world'), 7);
  assert.equal(parseTimestamp('01:02:03.004'), 3_723_004);
  assert.equal(parseTimestamp('02:03,004'), 123_004);
});
