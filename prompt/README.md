# System Prompts & Templates

Thư mục này chứa các system prompts và templates cho AI translator.

## System Prompts

### `system_prompt_v3.md` (Current - Default)
- Version mới nhất
- Được sử dụng mặc định trong `environment.js`
- Tối ưu cho translation Vietnamese → Chinese (Traditional)

### `system_prompt_v2.md`
- Version cũ hơn
- Có thêm bảng từ điển thuật ngữ

### `system_prompt_v1.md`
- Version đầu tiên
- Archive reference

## Translation Templates

### `translation_template.md` (Default)
Template cho nội dung gửi đến AI. Sử dụng placeholder format `{{key}}` để replace động.

**Placeholders:**
- `{{text}}` - Text cần dịch

**Example:**
```markdown
You are a translator. Translate the following text from Vietnamese to Chinese.

\`\`\`
{{text}}
\`\`\`
```

### `translation_template.example.md`
Template mẫu với nhiều placeholders để tham khảo.

## Sử dụng

### System Prompt

Config trong `environment.js`:

```javascript
DEFAULT_SYSTEM_PROMPT: 'prompt/system_prompt_v3.md'
```

Override bằng environment variable:

```bash
DEFAULT_SYSTEM_PROMPT=prompt/system_prompt_v2.md node main.js
```

### Translation Template

Config trong `environment.js`:

```javascript
TRANSLATION_TEMPLATE: 'prompt/translation_template.md'
```

Override bằng environment variable:

```bash
TRANSLATION_TEMPLATE=prompt/my_custom_template.md node main.js
```

### Sử dụng trong code:

```javascript
import { translate } from './translator.js';

// Sử dụng default template
const result = await translate('Xin chào');

// Custom template
const result = await translate('Xin chào', {
    template: 'prompt/my_template.md'
});
```

### Template Placeholder System

Hàm `replaceTemplatePlaceholders()` được define trong `regex.js`:

```javascript
import { replaceTemplatePlaceholders } from './regex.js';

const template = 'Hello {{name}}, translate: {{text}}';
const result = replaceTemplatePlaceholders(template, {
    name: 'User',
    text: 'Xin chào'
});
// Result: "Hello User, translate: Xin chào"
```

