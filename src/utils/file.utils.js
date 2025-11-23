import fs from 'fs';

/**
 * Đọc file với encoding UTF-8
 * @param {string} filePath - Đường dẫn file
 * @param {Function} callback - Callback (err, data)
 */
function readUnicodeFile(filePath, callback) {
    fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}

/**
 * Ghi file với encoding UTF-8
 * @param {string} filePath - Đường dẫn file
 * @param {string} content - Nội dung cần ghi
 * @param {Function} callback - Callback (err)
 */
function writeUnicodeFile(filePath, content, callback) {
    fs.writeFile(filePath, content, { encoding: 'utf8' }, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

/**
 * Đọc file đồng bộ với encoding UTF-8
 * @param {string} filePath - Đường dẫn file
 * @returns {string} - Nội dung file
 */
function readUnicodeFileSync(filePath) {
    return fs.readFileSync(filePath, { encoding: 'utf8' });
}

/**
 * Ghi file đồng bộ với encoding UTF-8
 * @param {string} filePath - Đường dẫn file
 * @param {string} content - Nội dung cần ghi
 */
function writeUnicodeFileSync(filePath, content) {
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });
}

export {
    readUnicodeFile,
    writeUnicodeFile,
    readUnicodeFileSync,
    writeUnicodeFileSync
};

