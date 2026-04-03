const crypto = require('crypto');
function encrypt(text, password) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  const fullData = Buffer.concat([encrypted, tag]);
  
  return JSON.stringify({
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    data: fullData.toString('base64')
  });
}
console.log(encrypt('github_pat_PLACEHOLDER_TOKEN', 'kantorek'));
