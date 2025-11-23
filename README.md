# Vietnamese to Chinese Translator

🚀 Automated translation tool from Vietnamese to Traditional Chinese using Google Gemini AI with placeholder management system.

## 📋 Features

- ✅ **Smart Placeholder System**: Automatically extracts and preserves proper nouns, product codes, and technical terms
- ✅ **Gemini AI Integration**: Uses Google Gemini 2.5 Pro for high-quality translation
- ✅ **Unicode Support**: Full Vietnamese and Chinese character support
- ✅ **Template System**: Customizable translation prompts and templates
- ✅ **Modular Architecture**: Clean, organized, and maintainable code structure
- ✅ **Environment Configuration**: Easy configuration via environment variables

## 🏗️ Project Structure

```
translator/
├── main.js                              # Main entry point
├── .env                                 # Environment variables (create from .env.example)
├── package.json                         # Dependencies
├── src/                                 # Source code
│   ├── translator.js                    # Core translation module
│   ├── environment.js                   # Environment configuration
│   └── utils/                           # Utility modules
│       ├── file.utils.js                # File I/O operations
│       └── regex.utils.js               # Placeholder & regex utilities
├── prompt/                              # AI prompts & templates
│   ├── system_prompt_v3.md              # System prompt (current)
│   └── translation_template.md          # Translation template
└── test_1.txt                           # Input file (example)
```

## 📦 Installation

### Prerequisites

- Node.js >= 18.x
- Google AI API Key ([Get it here](https://aistudio.google.com/app/apikey))

### Setup

1. **Clone the repository**
   ```bash
   cd translator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   DEFAULT_MODEL=gemini-2.5-pro
   DEFAULT_SYSTEM_PROMPT=prompt/system_prompt_v3.md
   TRANSLATION_TEMPLATE=prompt/translation_template.md
   INPUT_FILE=test_1.txt
   ```

## 🚀 Usage

### Basic Usage

Run the translator with default configuration:

```bash
node main.js
```

This will:
1. Read input from `test_1.txt` (or file specified in `INPUT_FILE` env var)
2. Extract placeholders for names, product codes, etc.
3. Translate the text to Traditional Chinese
4. Restore placeholders with original Vietnamese values
5. Save output to `output_final.txt`

### Debug Mode

Run with detailed logging:

```bash
node main.js
```

The script will show:
- Each extraction step with counts
- Translation progress
- Final mapping of all placeholders

### Custom Input File

```bash
INPUT_FILE=my_document.txt node main.js
```

### Custom Model

```bash
DEFAULT_MODEL=gemini-2.0-flash-exp node main.js
```

### Custom System Prompt

```bash
DEFAULT_SYSTEM_PROMPT=prompt/system_prompt_v2.md node main.js
```

## 🔄 How It Works

### Translation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     PHASE 1: EXTRACTION                     │
│  Extract placeholders from Vietnamese text                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
    Step 1: Vietnamese Names (Nguyễn Thị Hồng Cúc)
                            ↓
    Step 2: Product Codes (5606302VL)
                            ↓
    Step 3: Parentheses Content (SLEEVE)
                            ↓
    Step 4: English Names (Taillight, Chiplight)
                            ↓
    Step 5: Acronyms (QC, PCB, IPQC)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│          Text with placeholders: ${VIETNAMESE_NAME_1}       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 2: TRANSLATION                     │
│           Send to Gemini AI with placeholders               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 3: RESTORATION                     │
│      Replace placeholders with Vietnamese originals         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     PHASE 4: SAVE FILES                     │
│              Save final output to disk                      │
└─────────────────────────────────────────────────────────────┘
```

### Placeholder System

The translator extracts specific patterns and replaces them with placeholders:

| Type | Pattern | Example | Placeholder |
|------|---------|---------|-------------|
| Vietnamese Names | 2-3+ words with diacritics | Nguyễn Thị Hồng Cúc | ${VIETNAMESE_NAME_1} |
| Product Codes | Alphanumeric >= 6 chars | 5606302VL | ${PRODUCT_CODE_1} |
| Parentheses | ASCII content in () | (SLEEVE) | ${PARENTHESES_1} |
| English Names | Capitalized >= 5 chars | Taillight | ${ENGLISH_NAME_1} |
| Acronyms | All caps >= 3 chars | QC, PCB | ${ACRONYM_1} |

**Why placeholders?**
- Preserves proper nouns and technical terms
- Prevents AI from mistranslating names
- Maintains original Vietnamese names in output

## ⚙️ Configuration

### Environment Variables

All configuration is in `src/environment.js`:

```javascript
const env = {
    GOOGLE_API_KEY: getEnv('GOOGLE_API_KEY'),
    DEFAULT_MODEL: getEnv('DEFAULT_MODEL', 'gemini-2.5-pro'),
    DEFAULT_SYSTEM_PROMPT: getEnv('DEFAULT_SYSTEM_PROMPT', 'prompt/system_prompt_v3.md'),
    TRANSLATION_TEMPLATE: getEnv('TRANSLATION_TEMPLATE', 'prompt/translation_template.md'),
    INPUT_FILE: getEnv('INPUT_FILE', 'test_1.txt'),
    OUTPUT_DIR: getEnv('OUTPUT_DIR', '.'),
    NODE_ENV: getEnv('NODE_ENV', 'development'),
};
```

### System Prompts

Located in `prompt/` directory:

- `system_prompt_v3.md` - Current version with optimized terminology
- `system_prompt_v2.md` - Previous version with dictionary
- `system_prompt_v1.md` - Original version

### Translation Templates

Templates use `{{placeholder}}` syntax:

```markdown
You are a translator. Translate the following text from Vietnamese to Chinese.

\`\`\`
{{text}}
\`\`\`
```

The `{{text}}` placeholder is automatically replaced with the input text.

## 🛠️ Development

### Debug Commands

**Run with specific input:**
```bash
INPUT_FILE=my_test.txt node main.js
```

**Test individual modules:**
```bash
# Test file utils
node -e "import('./src/utils/file.utils.js').then(m => console.log(m.readUnicodeFileSync('test.txt')))"

# Test regex utils
node src/example.js
```

**Check environment config:**
```bash
node -e "import('./src/environment.js').then(m => console.log(m.default))"
```

### Project Commands

```bash
# Install dependencies
npm install

# Run translator
node main.js

# Run with custom env
INPUT_FILE=custom.txt DEFAULT_MODEL=gemini-2.0-flash-exp node main.js
```

### Output Files

After running, you'll find:

- `output_final.txt` - Final translated text with Vietnamese names restored

### Module Usage

Import and use individual modules:

```javascript
// Translation
import { translate } from './src/translator.js';
const result = await translate('Xin chào');

// File operations
import { readUnicodeFileSync } from './src/utils/file.utils.js';
const content = readUnicodeFileSync('input.txt');

// Placeholder extraction
import { matchVietnameseNames } from './src/utils/regex.utils.js';
const result = matchVietnameseNames('Nguyễn Văn A');
```

## 📊 Example

### Input (Vietnamese)

```
Đơn vị : Phòng QC 
Người báo cáo: Nguyễn Thị A B
Ngày báo cáo: 02/11/2024

1/ Giám sát, theo dõi QC nguyên liệu nhập, QC kiểm tra lưu động, thành phẩm.
 * Theo dõi sửa khuôn linh kiện lens ABC ABC bị nứt
```

### Processing

```
Step 1: Extract Vietnamese Names
   ✓ Found 1 match

Step 2: Extract Product Codes
   ✓ Found 0 matches

Step 3: Extract Parentheses Content
   ✓ Found 0 matches

Step 4: Extract English Names
   ✓ Found 2 matches

Step 5: Extract Acronyms
   ✓ Found 5 matches

Step 6: Translating text...
   ✓ Translation completed

Step 7: Restoring placeholders...
   ✓ Placeholders restored
```

### Output (Traditional Chinese)

```
部門：品管部
報告人：Nguyễn Thị A B
報告日期：2024年11月02日

1/ 監督、追蹤進料品管、巡檢品管及成品品管。
 * 追蹤 ABC ABC 燈罩零件模具龜裂修復狀況。
```

## 📝 Notes

- **API Costs**: Uses Google Gemini AI which may incur costs based on usage
- **Rate Limits**: Be aware of API rate limits for your key
- **Unicode**: Ensure your text editor supports UTF-8 encoding
- **Placeholders**: Vietnamese names are preserved in the output (not translated to Chinese)

## 🤝 Contributing

This is an internal tool. For improvements or bug fixes:

1. Test your changes thoroughly
2. Update documentation if needed
3. Follow the existing code structure

## 📄 License

Internal use only.

---

**Last Updated:** November 23, 2025
**Version:** 2.0.0

