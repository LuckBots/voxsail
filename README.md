# VoxSail

**AI video translation and multilingual dubbing for creators, educators, and global teams.**

[![Quality](https://github.com/LuckBots/voxsail/actions/workflows/quality.yml/badge.svg)](https://github.com/LuckBots/voxsail/actions/workflows/quality.yml)

[Official website](https://voxsail.com/?utm_source=github&utm_medium=repository&utm_campaign=voxsail) · [Try video translation](https://voxsail.com/en/video-translate?utm_source=github&utm_medium=repository&utm_campaign=voxsail) · [中文说明](./README.zh-CN.md)

VoxSail helps turn one video into localized versions for different languages. It brings speech recognition, subtitle translation, AI dubbing, voice cloning, lip synchronization, and video export into one workflow.

## What VoxSail does

- **AI video translation** — transcribe spoken content, translate subtitles, generate localized speech, and export the finished video.
- **Multilingual dubbing** — create target-language voice tracks while keeping timing aligned with the source.
- **Subtitle transcription and translation** — convert speech into editable subtitles and prepare multilingual subtitle tracks.
- **Voice cloning** — preserve a recognizable speaking style when a supported voice-cloning workflow is selected.
- **Lip-sync localization** — align translated speech with visible mouth movement for supported video workflows.
- **Audio translation and text voice-over** — localize audio-only content or turn translated scripts into speech.

## Typical workflow

```text
Upload media
    → Separate and analyze audio
    → Transcribe speech
    → Edit and translate subtitles
    → Generate localized voices
    → Mix audio and synchronize video
    → Review and export
```

## Who it is for

VoxSail is designed for video creators, educators, marketing teams, podcasters, interview producers, and organizations localizing training or support content.

## Runnable open-source tool

This repository includes **VoxSail Subtitle Quality Checker**, a zero-dependency Node.js CLI and library for SRT and WebVTT files. It reports invalid timing, unexpected overlaps, short cues, excessive reading speed, empty text, ordering problems, and cues beyond the media duration.

Requirements: Node.js 22+ and pnpm.

```bash
git clone https://github.com/LuckBots/voxsail.git
cd voxsail
corepack enable
pnpm install
pnpm demo
```

Check your own subtitle file:

```bash
pnpm subtitle:check ./path/to/subtitles.srt
pnpm subtitle:check ./path/to/subtitles.vtt --format json
pnpm subtitle:check ./path/to/subtitles.srt --strict --max-cps 18
```

The checker is intentionally non-destructive: it reports possible problems without rewriting the source file. Subtitle overlap is a warning because overlapping cues may be intentional in multi-speaker content.

See the [package documentation](./packages/subtitle-qc/README.md), [SRT sample](./examples/sample.srt), and [WebVTT sample](./examples/sample.vtt).

## Practical guide

Read the [video localization workflow and quality checklist](./docs/video-localization-workflow.md) for an overview of transcription, translation, dubbing, subtitle timing, audio mixing, and export validation.

## Product links

- [AI video translator](https://voxsail.com/en/video-translate?utm_source=github&utm_medium=repository&utm_campaign=voxsail)
- [Audio translator](https://voxsail.com/en/audio-translate?utm_source=github&utm_medium=repository&utm_campaign=voxsail)
- [Subtitle transcription](https://voxsail.com/en/subtitle-transcribe?utm_source=github&utm_medium=repository&utm_campaign=voxsail)
- [Text voice-over](https://voxsail.com/en/text-voiceover?utm_source=github&utm_medium=repository&utm_campaign=voxsail)
- [Documentation](https://voxsail.com/en/docs?utm_source=github&utm_medium=repository&utm_campaign=voxsail)
- [Pricing](https://voxsail.com/en/pricing?utm_source=github&utm_medium=repository&utm_campaign=voxsail)

## About this repository

This is the public GitHub home of VoxSail. It contains runnable open-source tools, product information, practical video-localization documentation, examples, and future reproducible evaluation resources. The production application source code and infrastructure configuration are maintained privately.

Questions and suggestions are welcome through [GitHub Issues](https://github.com/LuckBots/voxsail/issues).

## License

Documentation and public examples in this repository are available under the [MIT License](./LICENSE).
