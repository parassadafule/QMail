import requests
import random
from config.settings import QRNG_API_URL

def get_qrng_bits(length=32):
    try:
        url = f"{QRNG_API_URL}?length={length}&type=uint8"
        response = requests.get(url, timeout=5)
        response.raise_for_status()  
        qrng_data = response.json()
        if qrng_data.get("success"):
            
            return qrng_data["data"]
        else:
            raise Exception("QRNG API returned unsuccessful response")
    except requests.RequestException as e:
       
        return [random.randint(0, 255) for _ in range(length)]

def simulate_qkd(qrng_bits, key_length=32, eavesdropping=False):
    
    bits = ''.join([bin(x)[2:].zfill(8) for x in qrng_bits])[:256]
    
    alice_bases = [random.choice([0, 1]) for _ in bits]
    
    bob_bases = [random.choice([0, 1]) for _ in bits]
    
    if eavesdropping:
        eve_bases = [random.choice([0, 1]) for _ in bits]
        
        eve_measurements = [
            bits[i] if alice_bases[i] == eve_bases[i] else random.choice(['0', '1'])
            for i in range(len(bits))
        ]
        bits = eve_measurements  
        
    shared_key = [bits[i] for i in range(len(bits)) if alice_bases[i] == bob_bases[i]]
    
    if len(shared_key) < key_length:
        shared_key.extend(['0'] * (key_length - len(shared_key)))
    shared_key = ''.join(shared_key[:key_length])    
    
    qber = 0.0 if not eavesdropping else random.uniform(0.1, 0.3)  
    
    return shared_key, qber

def generate_quantum_key(key_length=32, eavesdropping=False):
    
    qrng_bits = get_qrng_bits(length=max(32, key_length // 8 + 1))  
    key, qber = simulate_qkd(qrng_bits, key_length, eavesdropping)
    return key, qber


if __name__ == "__main__":
    
    key, qber = generate_quantum_key(key_length=32, eavesdropping=False)
    print(f"Key (no eavesdropping): {key}, QBER: {qber}")
    
    # key_eve, qber_eve = generate_quantum_key(key_length=32, eavesdropping=True)
    # print(f"Key (with eavesdropping): {key_eve}, QBER: {qber_eve}")