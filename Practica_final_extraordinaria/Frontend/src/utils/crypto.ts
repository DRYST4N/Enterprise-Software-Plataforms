import CriptoJS from 'crypto-js';

const SECRET_KEY = 'clavesecretaparaesconderlastarjet';

export function encryptCardData(text: string): string{
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(text, CriptoJS.enc.Utf8.parse(SECRET_KEY), {
        iv: iv,
        mode: CriptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return iv.toString(CriptoJS.enc.Hex) + ':' + encrypted.toString();
}