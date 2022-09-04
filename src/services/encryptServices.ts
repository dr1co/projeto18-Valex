import bcrypt from 'bcrypt'
import Cryptr from 'cryptr';
const cryptr = new Cryptr('secretkey');

export function generateEncryptedPassword(password: string) {
    return bcrypt.hashSync(password, 10);
}

export function encryptSecCode(secCode: string) {
    return cryptr.encrypt(secCode);
}

export function decryptSecCode(secCode: string) {
    return cryptr.decrypt(secCode);
}