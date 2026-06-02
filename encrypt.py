import base64
import os
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

password = b"kantorek"
token = b"github_pat_PLACEHOLDER_TOKEN"

salt = os.urandom(16)
kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256(),
    length=32,
    salt=salt,
    iterations=100000,
    backend=default_backend()
)
key = kdf.derive(password)
aesgcm = AESGCM(key)
nonce = os.urandom(12)
ct = aesgcm.encrypt(nonce, token, None)

print(f'{{"salt": "{base64.b64encode(salt).decode("utf-8")}", "iv": "{base64.b64encode(nonce).decode("utf-8")}", "data": "{base64.b64encode(ct).decode("utf-8")}"}}')
