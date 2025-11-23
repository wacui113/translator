// Global mapping để lưu tất cả placeholder và giá trị thực
const globalMapping = {};

/**
 * Match pattern trong text với optional filter
 * @param {string} text - Text cần match
 * @param {string} pattern - Regex pattern
 * @param {boolean} filterAccented - Filter chỉ giữ có dấu tiếng Việt
 * @returns {Array} - Mảng các matches
 */
function matchPatternInText(text, pattern, filterAccented = false) {
    // Normalize Unicode to NFC (precomposed form)
    const normalizedText = text.normalize('NFC');
    const regex = new RegExp(pattern, 'gu');
    let matches = normalizedText.match(regex) || [];
    
    // Filter: chỉ giữ các match có ít nhất 1 ký tự tiếng Việt có dấu
    if (filterAccented) {
        const accentedRegex = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
        matches = matches.filter(m => accentedRegex.test(m));
    }
    
    return matches;
}

/**
 * Replace matches trong text bằng placeholder và lưu mapping
 * @param {string} text - Text gốc
 * @param {Array} matches - Mảng các matches
 * @param {string} placeholderPrefix - Prefix cho placeholder (VD: "VIETNAMESE_NAME")
 * @returns {Object} {text: newText, mapping: {...}}
 */
function replaceWithPlaceholders(text, matches, placeholderPrefix) {
    let newText = text;
    const mapping = {};
    let counter = 1;
    
    // Loại bỏ duplicate và sort theo độ dài giảm dần (match cụm dài trước)
    const uniqueMatches = [...new Set(matches.map(m => m.trim()))];
    uniqueMatches.sort((a, b) => b.length - a.length);
    
    uniqueMatches.forEach(match => {
        if (!match) return;
        
        // Escape regex special characters
        const escapedMatch = match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Tìm tất cả vị trí của match trong text
        const positions = [];
        let searchText = newText;
        let offset = 0;
        let index;
        
        while ((index = searchText.indexOf(match)) !== -1) {
            const actualIndex = offset + index;
            
            // Kiểm tra xem vị trí này có nằm trong placeholder không
            // Tìm ${...} gần nhất trước vị trí này
            const beforeText = newText.substring(0, actualIndex);
            const lastPlaceholderStart = beforeText.lastIndexOf('${');
            
            // Nếu có ${  trước match
            if (lastPlaceholderStart !== -1) {
                const afterPlaceholderStart = newText.substring(lastPlaceholderStart);
                const placeholderEnd = afterPlaceholderStart.indexOf('}');
                
                // Nếu match nằm giữa ${ và }
                if (placeholderEnd > (actualIndex - lastPlaceholderStart)) {
                    // Skip vị trí này - nó nằm trong placeholder
                    searchText = searchText.substring(index + match.length);
                    offset += index + match.length;
                    continue;
                }
            }
            
            positions.push(actualIndex);
            searchText = searchText.substring(index + match.length);
            offset += index + match.length;
        }
        
        // Replace từ cuối về đầu để không ảnh hưởng index
        if (positions.length > 0) {
            const placeholder = `\${${placeholderPrefix}_${counter}}`;
            
            for (let i = positions.length - 1; i >= 0; i--) {
                const pos = positions[i];
                newText = newText.substring(0, pos) + placeholder + newText.substring(pos + match.length);
            }
            
            mapping[placeholder] = match;
            globalMapping[placeholder] = match;
            counter++;
        }
    });
    
    return { text: newText, mapping };
}

/**
 * ROUND 1: Match tên người Việt (2-3+ từ, có dấu)
 */
function matchVietnameseNames(text) {
    const upper = "A-ZÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ";
    const lower = "a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ";
    
    const pattern = `(?<!^)[${upper}][${lower}]{0,15}\\s[${upper}][${lower}]{1,15}(?:\\s[${upper}][${lower}]{1,15}){0,3}\\s?`;
    
    const matches = matchPatternInText(text, pattern, true); // filter có dấu
    return replaceWithPlaceholders(text, matches, "VIETNAMESE_NAME");
}

/**
 * ROUND 2: Match mã sản phẩm (có số + chữ HOA, tối thiểu 6 ký tự)
 */
function matchProductCodes(text) {
    // Pattern: bất kỳ chuỗi nào có CẢ số VÀ chữ HOA
    const pattern = `[A-Z0-9]+`;
    const matchesRaw = matchPatternInText(text, pattern, false);
    
    // Filter: phải có cả số VÀ chữ, và >= 6 ký tự
    const matches = matchesRaw.filter(m => {
        const hasDigit = /\d/.test(m);
        const hasUpper = /[A-Z]/.test(m);
        return hasDigit && hasUpper && m.length >= 6;
    });
    
    return replaceWithPlaceholders(text, matches, "PRODUCT_CODE");
}

/**
 * ROUND 3: Match chú thích trong ngoặc () - chỉ ASCII (số, chữ, ký tự đặc biệt)
 */
function matchParenthesesContent(text) {
    // Pattern: nội dung trong () - chỉ ASCII, không unicode
    const pattern = `\\(([A-Z0-9][A-Z0-9\\s\\-,.'/:]*?)\\)`;
    const matchesRaw = text.match(new RegExp(pattern, 'gi')) || [];
    
    // Lấy nội dung bên trong (bỏ dấu ngoặc)
    const matches = matchesRaw.map(m => m.replace(/^\(|\)$/g, '').trim());
    
    return replaceWithPlaceholders(text, matches, "PARENTHESES");
}

/**
 * ROUND 4: Match tên tiếng Anh (bắt đầu viết hoa, tối thiểu 5 ký tự)
 */
function matchEnglishNames(text) {
    // Pattern: từ hoặc cụm từ bắt đầu bằng chữ HOA, chỉ A-Z (không dấu)
    // Cả từ đơn và cụm - tối thiểu 5 ký tự
    const patternSingle = `[A-Z][a-z]{4,15}(?=\\s|$|,|\\))`;
    const patternPhrase = `[A-Z][a-z]{4,15}(?:\\s[A-Z][a-z]{4,15}){1,3}`;
    
    // Match cụm trước (dài hơn)
    const matchesPhrase = matchPatternInText(text, patternPhrase, false);
    const matchesSingle = matchPatternInText(text, patternSingle, false);
    
    // Blacklist từ thông dụng
    const blacklist = ['Giám', 'Theo', 'Ngày', 'Nội', 'Người', 'Phòng'];
    
    // Filter: không có ký tự Việt và không trong blacklist
    const allMatches = [...matchesPhrase, ...matchesSingle].filter(m => 
        !/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(m) &&
        !blacklist.includes(m.trim()) &&
        m.trim().length >= 5
    );
    
    return replaceWithPlaceholders(text, allMatches, "ENGLISH_NAME");
}

/**
 * ROUND 5: Match từ viết tắt toàn HOA (tối thiểu 3 ký tự)
 */
function matchAcronyms(text) {
    const pattern = `[A-Z]{3,}(?=\\s|$|,|\\.|\\)|:)`;
    const matches = matchPatternInText(text, pattern, false);
    
    return replaceWithPlaceholders(text, matches, "ACRONYM");
}

/**
 * Reset global mapping
 */
function resetGlobalMapping() {
    Object.keys(globalMapping).forEach(key => delete globalMapping[key]);
}

/**
 * Get global mapping
 */
function getGlobalMapping() {
    return globalMapping;
}

/**
 * Restore placeholders trong text bằng giá trị thực từ globalMapping
 * @param {string} text - Text chứa placeholders
 * @returns {string} - Text đã restore
 */
function restorePlaceholders(text) {
    let restoredText = text;
    
    // Replace từng placeholder bằng giá trị thực
    // Không cần regex - chỉ cần replace all occurrences
    Object.entries(globalMapping).forEach(([placeholder, value]) => {
        restoredText = restoredText.replaceAll(placeholder, value);
    });
    
    return restoredText;
}

/**
 * Replace template placeholders in format {{key}} with values
 * @param {string} template - Template string with {{placeholder}} format
 * @param {Object} values - Object with placeholder values
 * @returns {string} - String with placeholders replaced
 */
function replaceTemplatePlaceholders(template, values) {
    let result = template;
    
    // Replace each placeholder {{key}} with its value
    Object.entries(values).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        result = result.replaceAll(placeholder, value);
    });
    
    return result;
}

export {
    matchPatternInText,
    replaceWithPlaceholders,
    matchVietnameseNames,
    matchProductCodes,
    matchParenthesesContent,
    matchEnglishNames,
    matchAcronyms,
    resetGlobalMapping,
    getGlobalMapping,
    restorePlaceholders,
    replaceTemplatePlaceholders
};

