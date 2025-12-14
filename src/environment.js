/**
 * Environment Configuration Module
 * 
 * Centralized configuration for all environment variables.
 * Automatically loads from .env file if exists.
 * 
 * Usage:
 * ```javascript
 * import env from './environment.js';
 * console.log(env.GOOGLE_API_KEY);
 * console.log(env.DEFAULT_MODEL);
 * ```
 * 
 * You can also use utility functions:
 * ```javascript
 * import { getEnv, getRequiredEnv } from './environment.js';
 * const apiKey = getEnv('MY_KEY', 'default_value');
 * const required = getRequiredEnv('MUST_EXIST'); // throws if not found
 * ```
 */

// Load environment variables from .env file (if exists)
import dotenv from 'dotenv';
dotenv.config();

/**
 * Get environment variable by key
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not found
 * @returns {string} - Environment variable value
 */
function getEnv(key, defaultValue = '') {
    return process.env[key] || defaultValue;
}

/**
 * Get environment variable and throw error if not found
 * @param {string} key - Environment variable key
 * @returns {string} - Environment variable value
 * @throws {Error} - If environment variable not found
 */
function getRequiredEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required but not found`);
    }
    return value;
}

/**
 * Check if environment variable exists
 * @param {string} key - Environment variable key
 * @returns {boolean} - True if exists
 */
function hasEnv(key) {
    return key in process.env && process.env[key] !== undefined && process.env[key] !== '';
}

/**
 * Environment configuration object
 * Centralized place for all environment variables
 */
const env = {
    // Google AI Configuration
    GOOGLE_API_KEY: getEnv('GOOGLE_API_KEY'),
    
    // Translation Configuration
    DEFAULT_MODEL: getEnv('DEFAULT_MODEL', 'gemini-2.5-pro'),
    DEFAULT_SYSTEM_PROMPT: getEnv('DEFAULT_SYSTEM_PROMPT', 'prompt/system_prompt_v3.md'),
    TRANSLATION_TEMPLATE: getEnv('TRANSLATION_TEMPLATE', 'prompt/translation_template.md'),
    
    // File Paths
    INPUT_FILE: getEnv('INPUT_FILE', 'original.txt'),
    OUTPUT_DIR: getEnv('OUTPUT_DIR', '.'),
    
    // Other configurations (add more as needed)
    NODE_ENV: getEnv('NODE_ENV', 'development'),
};

// Export the configuration object as default
export default env;

// Also export utility functions
export {
    getEnv,
    getRequiredEnv,
    hasEnv
};

