/** Global mapping: placeholder -> original value */
const globalMapping: Record<string, string> = {};

export interface MatchResult {
  text: string;
  mapping: Record<string, string>;
}

function matchPatternInText(
  text: string,
  pattern: string,
  filterAccented = false
): string[] {
  const normalizedText = text.normalize('NFC');
  const regex = new RegExp(pattern, 'gu');
  const raw = normalizedText.match(regex);
  let matches: string[] = raw ? Array.from(raw) : [];

  if (filterAccented) {
    const accentedRegex = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
    matches = matches.filter((m) => accentedRegex.test(m));
  }

  return matches;
}

function replaceWithPlaceholders(
  text: string,
  matches: string[],
  placeholderPrefix: string
): MatchResult {
  let newText = text;
  const mapping: Record<string, string> = {};
  let counter = 1;

  const uniqueMatches = [...new Set(matches.map((m) => m.trim()))];
  uniqueMatches.sort((a, b) => b.length - a.length);

  for (const match of uniqueMatches) {
    if (!match) continue;

    const escapedMatch = match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const positions: number[] = [];
    let searchText = newText;
    let offset = 0;
    let index: number;

    while ((index = searchText.indexOf(match)) !== -1) {
      const actualIndex = offset + index;
      const beforeText = newText.substring(0, actualIndex);
      const lastPlaceholderStart = beforeText.lastIndexOf('${');

      if (lastPlaceholderStart !== -1) {
        const afterPlaceholderStart = newText.substring(lastPlaceholderStart);
        const placeholderEnd = afterPlaceholderStart.indexOf('}');
        if (placeholderEnd > actualIndex - lastPlaceholderStart) {
          searchText = searchText.substring(index + match.length);
          offset += index + match.length;
          continue;
        }
      }

      positions.push(actualIndex);
      searchText = searchText.substring(index + match.length);
      offset += index + match.length;
    }

    if (positions.length > 0) {
      const placeholder = `\${${placeholderPrefix}_${counter}}`;
      for (let i = positions.length - 1; i >= 0; i--) {
        const pos = positions[i];
        newText =
          newText.substring(0, pos) + placeholder + newText.substring(pos + match.length);
      }
      mapping[placeholder] = match;
      globalMapping[placeholder] = match;
      counter++;
    }
  }

  return { text: newText, mapping };
}

export function matchVietnameseNames(text: string): MatchResult {
  const upper =
    'A-ZÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ';
  const lower =
    'a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ';
  const pattern = `(?<!^)[${upper}][${lower}]{0,15}\\s[${upper}][${lower}]{1,15}(?:\\s[${upper}][${lower}]{1,15}){0,3}\\s?`;
  const matches = matchPatternInText(text, pattern, true);
  return replaceWithPlaceholders(text, matches, 'VIETNAMESE_NAME');
}

export function matchProductCodes(text: string): MatchResult {
  const pattern = `[A-Z0-9]+`;
  const matchesRaw = matchPatternInText(text, pattern, false);
  const matches = matchesRaw.filter((m) => {
    const hasDigit = /\d/.test(m);
    const hasUpper = /[A-Z]/.test(m);
    return hasDigit && hasUpper && m.length >= 6;
  });
  return replaceWithPlaceholders(text, matches, 'PRODUCT_CODE');
}

export function matchParenthesesContent(text: string): MatchResult {
  const pattern = `\\(([A-Z0-9][A-Z0-9\\s\\-,.'/:]*?)\\)`;
  const matchesRaw = text.match(new RegExp(pattern, 'gi')) ?? [];
  const matches = matchesRaw.map((m) => m.replace(/^\(|\)$/g, '').trim());
  return replaceWithPlaceholders(text, matches, 'PARENTHESES');
}

export function matchEnglishNames(text: string): MatchResult {
  const patternSingle = `[A-Z][a-z]{4,15}(?=\\s|$|,|\\))`;
  const patternPhrase = `[A-Z][a-z]{4,15}(?:\\s[A-Z][a-z]{4,15}){1,3}`;
  const matchesPhrase = matchPatternInText(text, patternPhrase, false);
  const matchesSingle = matchPatternInText(text, patternSingle, false);
  const blacklist = ['Giám', 'Theo', 'Ngày', 'Nội', 'Người', 'Phòng'];
  const allMatches = [...matchesPhrase, ...matchesSingle].filter(
    (m) =>
      !/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(
        m
      ) &&
      !blacklist.includes(m.trim()) &&
      m.trim().length >= 5
  );
  return replaceWithPlaceholders(text, allMatches, 'ENGLISH_NAME');
}

export function matchAcronyms(text: string): MatchResult {
  const pattern = `[A-Z]{3,}(?=\\s|$|,|\\.|\\)|:)`;
  const matches = matchPatternInText(text, pattern, false);
  return replaceWithPlaceholders(text, matches, 'ACRONYM');
}

export function resetGlobalMapping(): void {
  for (const key of Object.keys(globalMapping)) delete globalMapping[key];
}

export function getGlobalMapping(): Record<string, string> {
  return globalMapping;
}

export function restorePlaceholders(text: string): string {
  let restoredText = text;
  for (const [placeholder, value] of Object.entries(globalMapping)) {
    restoredText = restoredText.replaceAll(placeholder, value);
  }
  return restoredText;
}

export function replaceTemplatePlaceholders(
  template: string,
  values: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}
