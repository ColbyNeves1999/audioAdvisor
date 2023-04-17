import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encrypt(plaintext: string): string {
  const iv = randomBytes(16).toString('hex');

  const cipher = createCipheriv(algorithm, key, iv);

  let encryptedText = cipher.update(plaintext, 'utf8', 'hex');
  encryptedText += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv}|${encryptedText}|${authTag}`;
}

function decrypt(cipherText: string): string {
  const [iv, encryptedText, authTag] = cipherText.split('|');

  const decipher = createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  let plain = decipher.update(encryptedText, 'hex', 'utf-8');
  plain += decipher.final('utf-8');
  return plain;
}

export { encrypt, decrypt };