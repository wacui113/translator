# Vietnamese to Chinese Translator (TypeScript)

TypeScript port of [konie-nhinhi-translator-go](https://github.com/wacui113/konie-nhinhi-translator-go).  
Automated translation from Vietnamese to Traditional Chinese (Taiwan) using Google Gemini AI, with placeholder handling for product codes, proper nouns, and technical terms.

## Features

- **Smart translation:** Context-aware (e.g. "Housing" for cable vs. lamp).
- **Data preservation:** Keeps product codes, proper nouns, acronyms (SOP, NG, OK), and numbers intact via regex extraction.
- **CLI:** Same usage as the Go version: `-input`, `-output`, `-model`, etc.
- **TypeScript:** Typed codebase, build with `npm run build`.
- **Unicode:** UTF-8 with NFC normalization.

## Installation

```bash
cd translator
npm install
```

## Configuration

1. Copy `.env.example` to `.env` (or create `.env`).
2. Set your Google API key:

```env
GOOGLE_API_KEY=AIzaSy...
DEFAULT_MODEL=gemini-2.5-flash
```

Get an API key: [Google AI Studio](https://aistudio.google.com/app/apikey).

## Usage

**Default (reads `original.txt`, writes `output_final.txt`):**

```bash
npm run build
npm start
```

**CLI (same as Go version):**

```bash
node dist/main.js -input=original.txt -output=ketqua.txt -model=gemini-1.5-pro
# or short form
node dist/main.js -i original.txt -o ketqua.txt -m gemini-1.5-pro
```

**Help:**

```bash
node dist/main.js --help
```

**Development (run without building):**

```bash
npm run dev
# with args: npm run dev -- -i original.txt -o out.txt
```

### CLI options

| Option | Short | Description |
|--------|-------|-------------|
| `--input` | `-i` | Input file path (default: `original.txt`) |
| `--output` | `-o` | Output file path (default: `output_final.txt`) |
| `--model` | `-m` | Gemini model (default: `gemini-2.5-flash`) |
| `--key` | `-k` | Google API key (overrides env) |
| `--prompt` | `-p` | System prompt file path |
| `--template` | `-t` | Translation template file path |
| `--help` | `-h` | Show help |
| `--telegram-token` | `-T` | Telegram bot token (for `npm run telegram`) |
| `--telegram-bot-id` | — | Telegram bot user ID, optional |
| `--telegram-poll-interval` | — | Poll interval in ms (default: 30000) |

Resolution order: **CLI flag > environment variable > default.**

### Telegram bot config

When running the Telegram bot (`npm run telegram`), you can pass bot token and options via **config** (env or CLI):

**Environment variables (e.g. in `.env`):**

```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_BOT_ID=123456789          # optional, bot's numeric user ID
TELEGRAM_POLL_INTERVAL_MS=30000
```

**CLI flags:**

```bash
npm run telegram -- -T 123456:ABC-DEF...
npm run telegram -- --telegram-token 123456:ABC-DEF... --telegram-poll-interval 15000
```

Same resolution order: CLI overrides env.

## Project structure

```
translator/
├── main.ts                 # Entry point (CLI + workflow)
├── tsconfig.json
├── src/
│   ├── environment.ts      # Env + CLI (commander)
│   ├── translator.ts       # Gemini translation
│   └── utils/
│       ├── file.utils.ts   # UTF-8 file I/O, fileExists
│       └── regex.utils.ts  # Placeholder extract/restore
├── prompt/
│   ├── system_prompt_v3.md
│   └── translation_template.md
└── dist/                   # Compiled JS (after npm run build)
```

## Translation flow (same as Go)

1. **Phase 1 – Extraction:** Replace sensitive segments with placeholders (Vietnamese names, product codes, parentheses, English names, acronyms).
2. **Phase 2 – Translation:** Send placeholderized text to Gemini.
3. **Phase 3 – Restoration:** Replace placeholders back with original values.
4. **Phase 4 – Save:** Write result to the file given by `-output` or default.

## Customization

- **Translation style:** Edit `prompt/system_prompt_v3.md`.
- **Output format:** Edit `prompt/translation_template.md`.

## Telegram bot

Long-running server that polls for new messages and replies with translated text:

```bash
npm run build
npm run telegram
```

Requires `GOOGLE_API_KEY` and `TELEGRAM_BOT_TOKEN` (env or `-T`). Optional: `TELEGRAM_BOT_ID`, `TELEGRAM_POLL_INTERVAL_MS`.

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| build | `npm run build` | Compile TypeScript to `dist/` |
| start | `npm start` | Run `node dist/main.js` (file mode) |
| telegram | `npm run telegram` | Run Telegram bot server |
| dev | `npm run dev` | Run with tsx (no build) |
| test | `npm test` | Run with `--help` |

## Comparison with Go version

This repo re-implements [konie-nhinhi-translator-go](https://github.com/wacui113/konie-nhinhi-translator-go) in TypeScript:

- Same 4-phase workflow and 5 extraction rounds.
- Same CLI flags: `-input`, `-output`, `-model`, `-key`, `-prompt`, `-template`.
- Validation: requires `GOOGLE_API_KEY`, checks input file exists.
- Output path: `-output` sets the output file path (not only directory).

See `COMPARISON.md` for a detailed feature comparison.

## License

MIT.
