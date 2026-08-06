# VoxSail 声帆

**面向创作者、教育机构和跨国团队的 AI 视频翻译与多语言配音平台。**

[![Quality](https://github.com/LuckBots/voxsail/actions/workflows/quality.yml/badge.svg)](https://github.com/LuckBots/voxsail/actions/workflows/quality.yml)

[官方网站](https://voxsail.com/zh?utm_source=github&utm_medium=repository&utm_campaign=voxsail) · [体验视频翻译](https://voxsail.com/zh/video-translate?utm_source=github&utm_medium=repository&utm_campaign=voxsail) · [English](./README.md)

VoxSail 声帆帮助用户把一个视频制作成不同语言的本地化版本，将语音识别、字幕翻译、AI 配音、音色复刻、口型同步和视频导出整合到一个工作流中。

## 核心能力

- **AI 视频翻译**：识别视频语音、翻译字幕、生成目标语言配音并导出成片。
- **多语言配音**：生成目标语言音轨，并尽量保持与原视频时间轴一致。
- **字幕转录与翻译**：将音频转换为可编辑字幕，制作多语言字幕轨道。
- **音色复刻**：在支持的流程中保留原说话人的可辨识声音风格。
- **口型同步**：在支持的视频流程中，使翻译后的语音与画面口型更加协调。
- **音频翻译与文本配音**：翻译音频内容，或将文本脚本转换为语音。

## 典型工作流

```text
上传视频
    → 分离并分析音频
    → 识别语音与生成字幕
    → 编辑和翻译字幕
    → 生成目标语言配音
    → 混音及音画同步
    → 检查并导出成片
```

## 适用场景

VoxSail 适用于出海视频创作者、在线课程与知识内容、产品宣传视频、播客和访谈，以及培训、帮助中心和跨语言传播内容。

## 可运行的开源工具

本仓库包含 **VoxSail Subtitle Quality Checker**：一个零运行时依赖的 SRT/WebVTT 字幕质量检查 CLI 和 JavaScript 库。它可以检查无效时间、相邻字幕重叠、字幕过短、阅读速度过快、空文本、顺序异常，以及字幕超出媒体时长等问题。

运行环境：Node.js 22+ 和 pnpm。

```bash
git clone https://github.com/LuckBots/voxsail.git
cd voxsail
corepack enable
pnpm install
pnpm demo
```

检查自己的字幕：

```bash
pnpm subtitle:check ./path/to/subtitles.srt
pnpm subtitle:check ./path/to/subtitles.vtt --format json
pnpm subtitle:check ./path/to/subtitles.srt --strict --max-cps 18
```

第一版工具只生成质量报告，不会改写源字幕。多说话人字幕可能有意重叠，因此重叠只报告为 warning，不会被自动修复。

参阅[工具说明](./packages/subtitle-qc/README.md)、[SRT 示例](./examples/sample.srt)和 [WebVTT 示例](./examples/sample.vtt)。

## 产品入口

- [AI 视频翻译](https://voxsail.com/zh/video-translate?utm_source=github&utm_medium=repository&utm_campaign=voxsail)
- [音频翻译](https://voxsail.com/zh/audio-translate?utm_source=github&utm_medium=repository&utm_campaign=voxsail)
- [字幕转录](https://voxsail.com/zh/subtitle-transcribe?utm_source=github&utm_medium=repository&utm_campaign=voxsail)
- [文本配音](https://voxsail.com/zh/text-voiceover?utm_source=github&utm_medium=repository&utm_campaign=voxsail)
- [使用文档](https://voxsail.com/zh/docs?utm_source=github&utm_medium=repository&utm_campaign=voxsail)
- [价格方案](https://voxsail.com/zh/pricing?utm_source=github&utm_medium=repository&utm_campaign=voxsail)

## 关于本仓库

这是 VoxSail 的公开 GitHub 品牌主页，用于发布可运行的开源工具、产品信息、视频本地化实践文档、示例和后续可复现的评测资料。生产应用源码、内部工作流及基础设施配置不在本仓库公开。

欢迎通过 [GitHub Issues](https://github.com/LuckBots/voxsail/issues) 提交问题和建议。

## 许可证

本仓库公开文档和示例采用 [MIT License](./LICENSE)。
