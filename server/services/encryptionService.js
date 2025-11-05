const crypto = require('crypto');
const { promisify } = require('util');

const generateKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

const encrypt = (text, key) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex')
    };
};

const decrypt = (encryptedData, key, iv) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

const encryptEmail = (emailData, key) => {
    const encryptedSubject = encrypt(emailData.subject, key);
    const encryptedBody = encrypt(emailData.body, key);
    
    return {
        encrypted_subject: encryptedSubject,
        encrypted_body: encryptedBody
    };
};

const decryptEmail = (encryptedEmail, key) => {
    const decryptedSubject = decrypt(
        encryptedEmail.encrypted_subject.encryptedData,
        key,
        encryptedEmail.encrypted_subject.iv
    );
    const decryptedBody = decrypt(
        encryptedEmail.encrypted_body.encryptedData,
        key,
        encryptedEmail.encrypted_body.iv
    );
    
    return {
        subject: decryptedSubject,
        body: decryptedBody
    };
};

module.exports = {
    generateKey,
    encrypt,
    decrypt,
    encryptEmail,
    decryptEmail
}; 