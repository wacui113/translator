/**
 * Vietnamese to Chinese translator (TypeScript port of konie-nhinhi-translator-go).
 * Usage: npm start -- -input=original.txt -output=ketqua.txt -model=gemini-1.5-pro
 *        npm start -- --help
 */

import { readUnicodeFileSync, writeUnicodeFileSync, fileExists } from './src/utils/file.utils.js';
import { getGlobalMapping } from './src/utils/regex.utils.js';
import { loadEnv, getConfig } from './src/environment.js';
import { runTranslationPipeline } from './src/pipeline.js';

const SEP = '='.repeat(60);

function logMapping(mapping: Record<string, string>, title: string): void {
  console.log(SEP);
  console.log(`🗺️  ${title}`);
  console.log(SEP);
  for (const [placeholder, value] of Object.entries(mapping)) {
    console.log(`${placeholder} → "${value}"`);
  }
  console.log(`\n✅ Total: ${Object.keys(mapping).length} items`);
  console.log(SEP + '\n');
}

async function main(): Promise<void> {
  loadEnv();

  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    return;
  }

  const config = getConfig();

  if (!config.GOOGLE_API_KEY) {
    console.error('❌ Error: GOOGLE_API_KEY is required.');
    console.error('   Set it via .env file, environment variable, or -k/--key flag.');
    process.exit(1);
  }

  if (!fileExists(config.INPUT_FILE)) {
    console.error(`❌ Error: Input file not found: ${config.INPUT_FILE}`);
    process.exit(1);
  }

  console.log(SEP);
  console.log('🚀 VIETNAMESE TO CHINESE TRANSLATOR (TypeScript)');
  console.log(SEP + '\n');

  let data: string;
  try {
    data = readUnicodeFileSync(config.INPUT_FILE);
  } catch (err) {
    console.error('❌ File read error:', err);
    process.exit(1);
  }

  console.log(`📄 Input file: ${config.INPUT_FILE}\n`);
  console.log('📋 Running translation pipeline...\n');

  let finalText: string;
  try {
    finalText = await runTranslationPipeline(data);
  } catch (err) {
    console.error('❌ Translation error:', err);
    process.exit(1);
  }

  console.log('💾 Saving output file...');
  writeUnicodeFileSync(config.OUTPUT_FILE, finalText);
  console.log(`   ✓ ${config.OUTPUT_FILE}\n`);

  const globalMapping = getGlobalMapping();
  logMapping(globalMapping, 'PLACEHOLDER MAPPING (1-1)');

  console.log(SEP);
  console.log('✅ TRANSLATION COMPLETED SUCCESSFULLY');
  console.log(SEP);
  console.log(`📊 Total placeholders: ${Object.keys(globalMapping).length}`);
  console.log(`📂 Output saved to: ${config.OUTPUT_FILE}`);
  console.log(SEP);
}

main();
