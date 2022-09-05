import bcrypt from 'bcrypt'
import Cryptr from 'cryptr';
const cryptr = new Cryptr('secretkey');

export function generateEncryptedPassword(password: string) {
    return bcrypt.hashSync(password, 10);
}

export function compareCrypt(password: string, comparator: string | undefined | null) {
    if (comparator)
        return bcrypt.compareSync(password, comparator);
    return false;
}

export function encryptSecCode(secCode: string) {
    return cryptr.encrypt(secCode);
}

export function decryptSecCode(secCode: string) {
    return cryptr.decrypt(secCode);
}