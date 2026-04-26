const crypto = require('crypto');
async function test() {
    const encryptedToken = '{"salt":"LMlxTK2srmkx1hFzkbKjjg==","iv":"HyLYS63JZQBtrG6m","data":"xKd2n6CzzGBD0doJNozVsGWlzVrWnIIi+os55u/Kw1u0uzlXCLeHwnv/jSz0qLFIonGF9JGjNFtB3aJFO85kOgouC2YMk21eqM9E5X8QZ28nQTaZMzjnsIhxXS1L15eRv5eIq70Y3IZ0Qk1+Kw=="}';
    const obj = JSON.parse(encryptedToken);
    const iv = Buffer.from(obj.iv, 'base64');
    const salt = Buffer.from(obj.salt, 'base64');
    const data = Buffer.from(obj.data, 'base64');

    // Trying 'prezentki' or 'admin' or whatever the user might have used as password. But actually, if they didn't change the password, I can just write a script that tests passwords from a short list or tests both iteration counts on a known password. 
    // Wait I don't know the password...
    // The previous token was '{"salt":"pr67W2hjwBP4UhuXtKPuaw==","iv":"YTVPvV87anPzmchA","data":"nMXFRtfjCnr3mjM0oNIoZYG9R+csqiUJY+4KkE+xmdBzzfFSJFPDeWC/g99zWsvQGPF9QHqWEFKQrvXCiWUOtjHL2yZAZlkW6IdH1VUr/GgkSjgUcEUt/XMcSnCM8r5A2xMDeiylRhn87EC2DQ=="}';

    const passwordsToTest = ['admin', 'prezentki', '1234', 'haslo'];

    for (let p of passwordsToTest) {
        for(let it of [20000, 100000]) {
            try {
                const key = crypto.pbkdf2Sync(p, salt, it, 32, 'sha256');
                const decipher = crypto.createDecipheriv('aes-256-gcm', iv, key);
                const authTag = data.subarray(data.length - 16);
                const ciphertext = data.subarray(0, data.length - 16);
                decipher.setAuthTag(authTag);
                let decrypted = decipher.update(ciphertext, undefined, 'utf8');
                decrypted += decipher.final('utf8');
                console.log('Success with password:', p, ' and iterations:', it);
                console.log('Decrypted token:', decrypted);
            } catch(e) {
                // Failed
            }
        }
    }
}
test();
