import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

export interface PasswordHasher {
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}

export class ScryptPasswordHasher implements PasswordHasher {
    async hash(password: string): Promise<string> {
        const salt = randomBytes(16).toString('hex');
        const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

        return `${salt}:${derivedKey.toString('hex')}`;
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        const [salt, storedHash] = hashedPassword.split(':');

        if (!salt || !storedHash) {
            return false;
        }

        const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
        const storedKey = Buffer.from(storedHash, 'hex');

        if (storedKey.length !== derivedKey.length) {
            return false;
        }

        return timingSafeEqual(storedKey, derivedKey);
    }
}