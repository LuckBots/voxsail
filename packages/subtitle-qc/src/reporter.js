function formatTimestamp(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.max(0, milliseconds % 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}

export function buildReport({ file, format, summary, issues }) {
  return {
    tool: 'VoxSail Subtitle Quality Checker',
    version: '0.1.0',
    file,
    subtitleFormat: format,
    summary,
    issues,
  };
}

export function formatTextReport(report) {
  const { summary } = report;
  const lines = [
    'VoxSail Subtitle Quality Report',
    '',
    `File: ${report.file}`,
    `Format: ${report.subtitleFormat.toUpperCase()}`,
    `Cues: ${summary.cueCount}`,
    `Quality score: ${summary.qualityScore}/100`,
    `Errors: ${summary.errorCount}`,
    `Warnings: ${summary.warningCount}`,
    '',
  ];

  if (report.issues.length === 0) {
    lines.push('✓ No quality issues detected.');
    return lines.join('\n');
  }

  lines.push('Issues');
  for (const issue of report.issues) {
    const symbol = issue.severity === 'error' ? '✗' : '⚠';
    lines.push(
      `${symbol} Cue ${issue.cue} [${issue.rule}] ${formatTimestamp(issue.startMs)} → ${formatTimestamp(issue.endMs)}`,
      `  ${issue.message}`,
    );
  }
  return lines.join('\n');
}
