import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const SCRYPT_KEY_LEN = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hashBuffer = (await scryptAsync(
    password,
    salt,
    SCRYPT_KEY_LEN,
  )) as Buffer;

  return `${salt}:${hashBuffer.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, hashHex] = storedHash.split(':');
  if (!salt || !hashHex) return false;

  const hashBuffer = Buffer.from(hashHex, 'hex');
  const candidateHash = (await scryptAsync(
    password,
    salt,
    SCRYPT_KEY_LEN,
  )) as Buffer;

  if (hashBuffer.length !== candidateHash.length) return false;

  return timingSafeEqual(hashBuffer, candidateHash);
}
