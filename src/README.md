# Source Code

Thư mục này chứa toàn bộ source code của translator.

## Structure

```
src/
├── translator.js        # Core translation module với Gemini AI
├── environment.js       # Environment configuration & variables
├── example.js           # Example usage của các modules
└── utils/
    ├── file.utils.js    # File I/O utilities (read/write Unicode)
    └── regex.utils.js   # Regex & placeholder management utilities
```

## Modules

### `translator.js`
Module chính để translate văn bản từ tiếng Việt sang tiếng Trung.

```javascript
import { translate } from './src/translator.js';
const result = await translate('Xin chào');
```

### `environment.js`
Centralized configuration cho tất cả environment variables.

```javascript
import env from './src/environment.js';
console.log(env.GOOGLE_API_KEY);
console.log(env.DEFAULT_MODEL);
```

### `example.js`
File example để test các modules riêng lẻ.

```bash
node src/example.js
```

## Utils

### `utils/file.utils.js`
Utilities cho file operations với Unicode support.

**Functions:**
- `readUnicodeFile(path, callback)`
- `readUnicodeFileSync(path)`
- `writeUnicodeFileSync(path, content)`

### `utils/regex.utils.js`
Utilities cho placeholder extraction và template replacement.

**Functions:**
- `matchVietnameseNames(text)`
- `matchProductCodes(text)`
- `matchParenthesesContent(text)`
- `matchEnglishNames(text)`
- `matchAcronyms(text)`
- `restorePlaceholders(text)`
- `replaceTemplatePlaceholders(template, values)`
- `getGlobalMapping()`
- `resetGlobalMapping()`

## Usage

Từ root directory, import modules:

```javascript
// Import translator
import { translate } from './src/translator.js';

// Import utils
import { readUnicodeFileSync } from './src/utils/file.utils.js';
import { matchVietnameseNames } from './src/utils/regex.utils.js';

// Import environment
import env from './src/environment.js';
```

