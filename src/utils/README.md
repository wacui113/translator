# Utilities

Thư mục này chứa các utility modules được sử dụng trong project.

## Modules

### `file.utils.js`

File I/O operations với Unicode support.

**Functions:**

- **`readUnicodeFile(filePath, callback)`**
  - Đọc file với encoding UTF-8 (async)
  - Parameters: `filePath` (string), `callback` (function)

- **`readUnicodeFileSync(filePath)`**
  - Đọc file với encoding UTF-8 (sync)
  - Returns: file content (string)

- **`writeUnicodeFileSync(filePath, content)`**
  - Ghi file với encoding UTF-8 (sync)
  - Parameters: `filePath` (string), `content` (string)

**Example:**

```javascript
import { readUnicodeFileSync, writeUnicodeFileSync } from './src/utils/file.utils.js';

const content = readUnicodeFileSync('input.txt');
writeUnicodeFileSync('output.txt', content);
```

---

### `regex.utils.js`

Placeholder extraction và template management utilities.

#### Placeholder Management

- **`matchVietnameseNames(text)`**
  - Extract tên người Việt (2-3+ từ, có dấu)
  - Returns: `{ text, mapping }`

- **`matchProductCodes(text)`**
  - Extract mã sản phẩm (số + chữ HOA, >= 6 ký tự)
  - Returns: `{ text, mapping }`

- **`matchParenthesesContent(text)`**
  - Extract nội dung trong ngoặc () (ASCII only)
  - Returns: `{ text, mapping }`

- **`matchEnglishNames(text)`**
  - Extract tên tiếng Anh (viết hoa, >= 5 ký tự)
  - Returns: `{ text, mapping }`

- **`matchAcronyms(text)`**
  - Extract từ viết tắt toàn HOA (>= 3 ký tự)
  - Returns: `{ text, mapping }`

#### Global Mapping

- **`getGlobalMapping()`**
  - Lấy global mapping object
  - Returns: mapping object

- **`resetGlobalMapping()`**
  - Reset global mapping về empty

#### Restoration

- **`restorePlaceholders(text)`**
  - Restore placeholders về giá trị gốc từ globalMapping
  - Parameters: `text` (string)
  - Returns: restored text (string)

#### Template

- **`replaceTemplatePlaceholders(template, values)`**
  - Replace placeholders `{{key}}` trong template
  - Parameters: `template` (string), `values` (object)
  - Returns: replaced text (string)

**Example:**

```javascript
import {
    matchVietnameseNames,
    restorePlaceholders,
    replaceTemplatePlaceholders,
    getGlobalMapping,
    resetGlobalMapping
} from './src/utils/regex.utils.js';

// Extract placeholders
resetGlobalMapping();
const result = matchVietnameseNames('Người báo cáo: Nguyễn Văn A');
console.log(result.text);
// Output: "Người báo cáo: ${VIETNAMESE_NAME_1}"

// Get mapping
const mapping = getGlobalMapping();
console.log(mapping);
// Output: { "${VIETNAMESE_NAME_1}": "Nguyễn Văn A" }

// Restore placeholders
const restored = restorePlaceholders(result.text);
console.log(restored);
// Output: "Người báo cáo: Nguyễn Văn A"

// Template replacement
const template = "Hello {{name}}, your score is {{score}}";
const filled = replaceTemplatePlaceholders(template, {
    name: "John",
    score: "100"
});
console.log(filled);
// Output: "Hello John, your score is 100"
```

## Naming Convention

Tất cả utility files follow naming pattern: `<name>.utils.js`

This makes it clear that these are utility modules and keeps the codebase organized.

