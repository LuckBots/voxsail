#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildReport, formatTextReport, parseSubtitle, summarizeQuality, validateSubtitles } from './index.js';

const HELP = `VoxSail Subtitle Quality Checker

Usage:
  subtitle-qc <file.srt|file.vtt> [options]

Options:
  --format <text|json>           Report format (default: text)
  --min-duration-ms <number>     Warn below this cue duration (default: 800)
  --max-cps <number>             Warn above this reading speed (default: 20)
  --media-duration-ms <number>   Error when a cue exceeds this duration
  --strict                       Exit with code 1 when warnings are present
  --help                         Show this help
`;

function readOptionValue(args, index, name) {
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${name} requires a value`);
  return value;
}

export function parseArguments(args) {
  const options = {
    file: null,
    format: 'text',
    minDurationMs: 800,
    maxCharactersPerSecond: 20,
    mediaDurationMs: null,
    strict: false,
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument === '--strict') options.strict = true;
    else if (argument === '--format') options.format = readOptionValue(args, index++, '--format');
    else if (argument === '--min-duration-ms') options.minDurationMs = Number(readOptionValue(args, index++, '--min-duration-ms'));
    else if (argument === '--max-cps') options.maxCharactersPerSecond = Number(readOptionValue(args, index++, '--max-cps'));
    else if (argument === '--media-duration-ms') options.mediaDurationMs = Number(readOptionValue(args, index++, '--media-duration-ms'));
    else if (argument.startsWith('--')) throw new Error(`Unknown option: ${argument}`);
    else if (options.file === null) options.file = argument;
    else throw new Error(`Unexpected argument: ${argument}`);
  }

  if (!['text', 'json'].includes(options.format)) throw new Error('--format must be text or json');
  return options;
}

export async function runCli(args, io = {}) {
  const writeOut = io.writeOut || ((value) => process.stdout.write(value));
  const writeError = io.writeError || ((value) => process.stderr.write(value));

  try {
    const options = parseArguments(args);
    if (options.help) {
      writeOut(HELP);
      return 0;
    }
    if (!options.file) throw new Error('A subtitle file is required. Use --help for usage.');

    const absolutePath = resolve(options.file);
    const content = await readFile(absolutePath, 'utf8');
    const parsed = parseSubtitle(content);
    const issues = validateSubtitles(parsed.cues, {
      minDurationMs: options.minDurationMs,
      maxCharactersPerSecond: options.maxCharactersPerSecond,
      mediaDurationMs: options.mediaDurationMs,
    });
    const summary = summarizeQuality(parsed.cues, issues);
    const report = buildReport({
      file: basename(absolutePath),
      format: parsed.format,
      summary,
      issues,
    });

    writeOut(options.format === 'json' ? `${JSON.stringify(report, null, 2)}\n` : `${formatTextReport(report)}\n`);
    return summary.errorCount > 0 || (options.strict && summary.warningCount > 0) ? 1 : 0;
  } catch (error) {
    writeError(`Subtitle QC failed: ${error.message}\n`);
    return 2;
  }
}

const isEntrypoint = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isEntrypoint) process.exitCode = await runCli(process.argv.slice(2));
