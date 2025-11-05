from requests import get
import secrets
import random

import requests
from config.settings import QRNG_API_URL, QRNG_API_KEY

def get_qrng_bytes(byte_length: int) -> bytes:
    try:
        cb = secrets.token_hex(8)
        params = {
            "length": byte_length,
            "type": "uint8",
            "apiKey": QRNG_API_KEY,
            "cb": cb,
        }
        resp = get(QRNG_API_URL, params=params, timeout=5)
        resp.raise_for_status()
        payload = resp.json()
        if payload.get("success") and "data" in payload:
            # data is a list of 0–255 integers
            return bytes(payload["data"][:byte_length])
        raise RuntimeError("QRNG API returned bad payload")
    except Exception:
        # Fallback
        return secrets.token_bytes(byte_length)

def generate_quantum_key(total_length: int):
    # key = get_qrng_bytes(total_length)
    # qber = 0.0
    # return key, qber
    alice_key = get_qrng_bytes(total_length)

    bob_key = alice_key[:]

    mismatches = sum(a != b for a, b in zip(alice_key, bob_key))
    qber = mismatches / total_length

    return alice_key, qber

# def get_qrng_bits(length=32):
#     try:
#         # build a cache-busting param to force a fresh HTTP GET
#         cb = secrets.token_hex(8)
#         params = {
#             "length": length,
#             "type": "uint8",
#             "apiKey": QRNG_API_KEY,
#             "cb": cb,
#         }
#         resp = requests.get(QRNG_API_URL, params=params, timeout=5)
#         resp.raise_for_status()

#         payload = resp.json()
#         if payload.get("success") and "data" in payload:
#             return payload["data"]
#         else:
#             raise RuntimeError("QRNG API returned unsuccessful payload")

#     except Exception:
#         # crypto-secure fallback
#         return [secrets.randbelow(256) for _ in range(length)]

# def simulate_qkd(qrng_bits, key_length=32, eavesdropping=False):
    
#     bits = ''.join(bin(b)[2:].zfill(8) for b in qrng_bits)[:256]

#     # pick random bases with secrets
#     alice_bases = [secrets.choice([0, 1]) for _ in bits]
#     bob_bases   = [secrets.choice([0, 1]) for _ in bits]

#     if eavesdropping:
#         eve_bases = [secrets.choice([0, 1]) for _ in bits]
#         # simulate Eve’s disturbance
#         bits = [
#             bits[i] if alice_bases[i] == eve_bases[i]
#             else secrets.choice(["0", "1"])
#             for i in range(len(bits))
#         ]

#     # sift the key
#     sifted = [bits[i] for i in range(len(bits)) 
#               if alice_bases[i] == bob_bases[i]]

#     # pad/truncate to desired length
#     if len(sifted) < key_length:
#         sifted += ["0"] * (key_length - len(sifted))
#     key = ''.join(sifted[:key_length])

#     qber = 0.0 if not eavesdropping else secrets.SystemRandom().uniform(0.1, 0.3)
#     return key, qber

if __name__ == "__main__":
    
    key, qber = generate_quantum_key(key_length=32, eavesdropping=False)
    print(f"Key (no eavesdropping): {key}, QBER: {qber}")
    
    # key_eve, qber_eve = generate_quantum_key(key_length=32, eavesdropping=True)
    # print(f"Key (with eavesdropping): {key_eve}, QBER: {qber_eve}")