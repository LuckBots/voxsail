export class SubtitleParseError extends Error {
  constructor(message, lineNumber = null) {
    super(lineNumber ? `${message} at line ${lineNumber}` : message);
    this.name = 'SubtitleParseError';
    this.lineNumber = lineNumber;
  }
}

export function parseTimestamp(value) {
  const match = /^(?:(\d+):)?(\d{2}):(\d{2})[,.](\d{3})$/.exec(value.trim());
  if (!match) return null;

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  const milliseconds = Number(match[4]);

  if (minutes > 59 || seconds > 59) return null;
  return (((hours * 60 + minutes) * 60 + seconds) * 1000) + milliseconds;
}

function detectFormat(content) {
  return content.trimStart().startsWith('WEBVTT') ? 'vtt' : 'srt';
}

function parseTimingLine(line, lineNumber) {
  const match = /^(\S+)\s+-->\s+(\S+)/.exec(line.trim());
  if (!match) {
    throw new SubtitleParseError('Invalid subtitle timing line', lineNumber);
  }

  const startMs = parseTimestamp(match[1]);
  const endMs = parseTimestamp(match[2]);
  if (startMs === null || endMs === null) {
    throw new SubtitleParseError('Invalid subtitle timestamp', lineNumber);
  }

  return { startMs, endMs };
}

export function parseSubtitle(content) {
  if (typeof content !== 'string' || content.trim() === '') {
    throw new SubtitleParseError('Subtitle content is empty');
  }

  const normalized = content.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const format = detectFormat(normalized);
  const lines = normalized.split('\n');
  const cues = [];

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();

    // WebVTT metadata blocks are not subtitle cues and may contain arrow-like text.
    if (/^(NOTE|STYLE|REGION)(?:\s|$)/.test(trimmed)) {
      while (index + 1 < lines.length && lines[index + 1].trim() !== '') index += 1;
      continue;
    }

    if (!trimmed.includes('-->')) continue;

    const { startMs, endMs } = parseTimingLine(trimmed, index + 1);
    const textLines = [];
    let cursor = index + 1;
    while (cursor < lines.length && lines[cursor].trim() !== '') {
      textLines.push(lines[cursor]);
      cursor += 1;
    }

    cues.push({
      index: cues.length + 1,
      sourceLine: index + 1,
      startMs,
      endMs,
      text: textLines.join('\n').trim(),
    });
    index = cursor;
  }

  if (cues.length === 0) {
    throw new SubtitleParseError('No subtitle cues found');
  }

  return { format, cues };
}

export function visibleCharacterCount(text) {
  const visibleText = text
    .replace(/<[^>]*>/g, '')
    .replace(/\{\\[^}]*}/g, '')
    .replace(/\s/g, '');
  return Array.from(visibleText).length;
}
