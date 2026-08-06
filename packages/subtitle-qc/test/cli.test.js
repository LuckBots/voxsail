import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import test from 'node:test';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const cliPath = resolve(currentDirectory, '../src/cli.js');
const fixturePath = resolve(currentDirectory, 'fixtures/problematic.srt');

test('prints a machine-readable JSON report and fails when errors exist', () => {
  const result = spawnSync(process.execPath, [cliPath, fixturePath, '--format', 'json', '--media-duration-ms', '10000'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  assert.equal(report.tool, 'VoxSail Subtitle Quality Checker');
  assert.equal(report.subtitleFormat, 'srt');
  assert.ok(report.summary.errorCount >= 2);
  assert.ok(report.issues.some((issue) => issue.rule === 'overlap'));
});

test('returns usage errors with exit code 2', () => {
  const result = spawnSync(process.execPath, [cliPath, '--format', 'xml'], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /format must be text or json/);
});
