# @voxsail/subtitle-qc

A zero-dependency Node.js CLI and library for checking SRT and WebVTT subtitle quality.

## Checks

- invalid or empty cue durations;
- out-of-order cues;
- overlapping adjacent cues;
- cues shorter than a configurable threshold;
- excessive characters per second;
- empty subtitle text;
- cues beyond a configured media duration.

Overlaps are warnings because multi-speaker subtitles can overlap intentionally. Version 0.1 reports problems but does not rewrite source files.

## CLI

```bash
pnpm subtitle:check examples/sample.srt
pnpm subtitle:check examples/sample.srt --format json
pnpm subtitle:check examples/sample.srt --strict --max-cps 18
```

## Library

```js
import { parseSubtitle, summarizeQuality, validateSubtitles } from '@voxsail/subtitle-qc';

const parsed = parseSubtitle(srtContent);
const issues = validateSubtitles(parsed.cues);
const summary = summarizeQuality(parsed.cues, issues);
```
