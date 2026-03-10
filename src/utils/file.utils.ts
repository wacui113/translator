import fs from 'fs';

const UTF8 = 'utf8';

/**
 * Read file as UTF-8 (async).
 */
export function readUnicodeFile(
  filePath: string,
  callback: (err: NodeJS.ErrnoException | null, data: string | null) => void
): void {
  fs.readFile(filePath, { encoding: UTF8 }, (err, data) => {
    if (err) callback(err, null);
    else callback(null, data);
  });
}

/**
 * Write file as UTF-8 (async).
 */
export function writeUnicodeFile(
  filePath: string,
  content: string,
  callback: (err: NodeJS.ErrnoException | null) => void
): void {
  fs.writeFile(filePath, content, { encoding: UTF8 }, callback);
}

/**
 * Read file synchronously as UTF-8.
 */
export function readUnicodeFileSync(filePath: string): string {
  return fs.readFileSync(filePath, { encoding: UTF8 });
}

/**
 * Write file synchronously as UTF-8.
 */
export function writeUnicodeFileSync(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, { encoding: UTF8 });
}

/**
 * Check if path exists and is a file.
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}
