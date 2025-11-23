// Import modules
import { readUnicodeFile, writeUnicodeFileSync } from './src/utils/file.utils.js';
import {
    matchVietnameseNames,
    matchProductCodes,
    matchParenthesesContent,
    matchEnglishNames,
    matchAcronyms,
    resetGlobalMapping,
    getGlobalMapping,
    restorePlaceholders
} from './src/utils/regex.utils.js';
import { translate } from './src/translator.js';
import env from './src/environment.js';

/**
 * Log mapping in a formatted way (reusable)
 * @param {Object} mapping - Mapping object to log
 * @param {string} title - Title for the mapping section
 */
function logMapping(mapping, title = 'MAPPING') {
    console.log("=".repeat(60));
    console.log(`🗺️  ${title}`);
    console.log("=".repeat(60));
    Object.entries(mapping).forEach(([placeholder, value]) => {
        console.log(`${placeholder} → "${value}"`);
    });
    console.log(`\n✅ Total: ${Object.keys(mapping).length} items`);
    console.log("=".repeat(60) + "\n");
}

/**
 * Extract Vietnamese Names from text
 * @param {string} text - Input text
 * @returns {string} - Text with placeholders
 */
function extractVietnameseNames(text) {
    console.log("🔵 STEP 1: Extracting Vietnamese Names...");
    const result = matchVietnameseNames(text);
    console.log(`   ✓ Found ${Object.keys(result.mapping).length} matches\n`);
    return result.text;
}

/**
 * Extract Product Codes from text
 * @param {string} text - Input text
 * @returns {string} - Text with placeholders
 */
function extractProductCodes(text) {
    console.log("🔵 STEP 2: Extracting Product Codes...");
    const result = matchProductCodes(text);
    console.log(`   ✓ Found ${Object.keys(result.mapping).length} matches\n`);
    return result.text;
}

/**
 * Extract Parentheses Content from text
 * @param {string} text - Input text
 * @returns {string} - Text with placeholders
 */
function extractParentheses(text) {
    console.log("🔵 STEP 3: Extracting Parentheses Content...");
    const result = matchParenthesesContent(text);
    console.log(`   ✓ Found ${Object.keys(result.mapping).length} matches\n`);
    return result.text;
}

/**
 * Extract English Names from text
 * @param {string} text - Input text
 * @returns {string} - Text with placeholders
 */
function extractEnglishNames(text) {
    console.log("🔵 STEP 4: Extracting English Names...");
    const result = matchEnglishNames(text);
    console.log(`   ✓ Found ${Object.keys(result.mapping).length} matches\n`);
    return result.text;
}

/**
 * Extract Acronyms from text
 * @param {string} text - Input text
 * @returns {string} - Text with placeholders
 */
function extractAcronyms(text) {
    console.log("🔵 STEP 5: Extracting Acronyms...");
    const result = matchAcronyms(text);
    console.log(`   ✓ Found ${Object.keys(result.mapping).length} matches\n`);
    return result.text;
}

/**
 * Translate text with placeholders
 * @param {string} text - Text with placeholders
 * @returns {Promise<string>} - Translated text
 */
async function translateText(text) {
    console.log("🌐 STEP 6: Translating text...");
    const translatedText = await translate(text);
    console.log("   ✓ Translation completed\n");
    return translatedText;
}

/**
 * Restore placeholders to original values
 * @param {string} text - Translated text with placeholders
 * @returns {string} - Final text with restored values
 */
function restoreToOriginalValues(text) {
    console.log("🔄 STEP 7: Restoring placeholders...");
    const restoredText = restorePlaceholders(text);
    console.log("   ✓ Placeholders restored\n");
    return restoredText;
}

/**
 * Save output files
 * @param {string} textWithPlaceholders - Text with placeholders
 * @param {string} translatedText - Translated text with placeholders
 * @param {string} finalText - Final text with restored values
 */
function saveOutputFiles(textWithPlaceholders, translatedText, finalText) {
    console.log("💾 STEP 8: Saving output files...");
    // console.log("   ✓ output.txt - Text with placeholders");
    // writeUnicodeFileSync('output.txt', textWithPlaceholders);
    // console.log("   ✓ output_translated.txt - Translated text");
    // writeUnicodeFileSync('output_translated.txt', translatedText);
    console.log("   ✓ output_final.txt - Final text with Vietnamese names");
    writeUnicodeFileSync('output_final.txt', finalText);
}

/**
 * Main translation workflow
 */
async function main() {
    console.log("=".repeat(60));
    console.log("🚀 VIETNAMESE TO CHINESE TRANSLATOR");
    console.log("=".repeat(60) + "\n");
    
    readUnicodeFile(env.INPUT_FILE, async (err, data) => {
        if (err) {
            console.error("❌ File read error:", err);
            return;
        }
        
        console.log(`📄 Input file: ${env.INPUT_FILE}\n`);
        
        // Initialize
        resetGlobalMapping();
        let currentText = data.normalize('NFC');
        
        // ========== EXTRACTION PHASE ==========
        console.log("=".repeat(60));
        console.log("📋 PHASE 1: EXTRACTING PLACEHOLDERS");
        console.log("=".repeat(60) + "\n");
        
        currentText = extractVietnameseNames(currentText);
        currentText = extractProductCodes(currentText);
        currentText = extractParentheses(currentText);
        currentText = extractEnglishNames(currentText);
        currentText = extractAcronyms(currentText);
        
        // ========== TRANSLATION PHASE ==========
        console.log("=".repeat(60));
        console.log("🌐 PHASE 2: TRANSLATION");
        console.log("=".repeat(60) + "\n");
        
        const translatedText = await translateText(currentText);
        
        // ========== RESTORATION PHASE ==========
        console.log("=".repeat(60));
        console.log("🔄 PHASE 3: RESTORING VALUES");
        console.log("=".repeat(60) + "\n");
        
        const finalText = restoreToOriginalValues(translatedText);
        
        // ========== SAVE FILES ==========
        console.log("=".repeat(60));
        console.log("💾 PHASE 4: SAVING FILES");
        console.log("=".repeat(60) + "\n");
        
        saveOutputFiles(currentText, translatedText, finalText);
        
        // ========== SHOW MAPPING ==========
        const globalMapping = getGlobalMapping();
        logMapping(globalMapping, 'PLACEHOLDER MAPPING (1-1)');
        
        // ========== SUMMARY ==========
        console.log("=".repeat(60));
        console.log("✅ TRANSLATION COMPLETED SUCCESSFULLY");
        console.log("=".repeat(60));
        console.log(`📊 Total placeholders: ${Object.keys(globalMapping).length}`);
        console.log(`📂 Output files saved in current directory`);
        console.log("=".repeat(60));
    });
}

// Run main
await main();
