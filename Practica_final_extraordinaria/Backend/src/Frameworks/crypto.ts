import crypto from 'crypto';

const ALGORITMO = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'clavesecretaparaesconderlastarjet';
const IV_LENGTH = 16;

export function decrypt(text: string): string {
    try{
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITMO, Buffer.from(SECRET_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
    }catch(error){
        throw new Error('Error al desencriptar los datos: El formato o la clave secretason inválidos.');
    }
}

