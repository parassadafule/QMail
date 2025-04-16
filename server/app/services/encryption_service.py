import binascii

def encrypt_email(email_data, key):

    try:
        subject = email_data.get("subject", "")
        body = email_data.get("body", "")
        if not subject or not body:
            raise ValueError("Email subject and body are required")
        
        subject_bytes = subject.encode('utf-8')
        body_bytes = body.encode('utf-8')
        
        
        required_length = len(subject_bytes) + len(body_bytes)
        key_bytes = key.encode('utf-8')
        if len(key_bytes) < required_length:
            raise ValueError(f"Key too short: {len(key_bytes)} bytes, need {required_length}")

        
        encrypted_subject = bytes(a ^ b for a, b in zip(subject_bytes, key_bytes[:len(subject_bytes)]))
        encrypted_body = bytes(a ^ b for a, b in zip(body_bytes, key_bytes[len(subject_bytes):required_length]))

        
        encrypted_email = email_data.copy()
        encrypted_email["subject"] = binascii.hexlify(encrypted_subject).decode('utf-8')
        encrypted_email["body"] = binascii.hexlify(encrypted_body).decode('utf-8')
        
        return encrypted_email

    except Exception as e:
        raise ValueError(f"Encryption failed: {str(e)}")

def decrypt_email(encrypted_email, key):

    try:
        encrypted_subject = encrypted_email.get("subject", "")
        encrypted_body = encrypted_email.get("body", "")
        if not encrypted_subject or not encrypted_body:
            raise ValueError("Encrypted subject and body are required")

        try:
            encrypted_subject_bytes = binascii.unhexlify(encrypted_subject)
            encrypted_body_bytes = binascii.unhexlify(encrypted_body)
        except binascii.Error:
            raise ValueError("Invalid ciphertext: Hex decoding failed")

        
        required_length = len(encrypted_subject_bytes) + len(encrypted_body_bytes)
        key_bytes = key.encode('utf-8')
        if len(key_bytes) < required_length:
            raise ValueError(f"Key too short: {len(key_bytes)} bytes, need {required_length}")

        
        decrypted_subject_bytes = bytes(a ^ b for a, b in zip(encrypted_subject_bytes, key_bytes[:len(encrypted_subject_bytes)]))
        decrypted_body_bytes = bytes(a ^ b for a, b in zip(encrypted_body_bytes, key_bytes[len(encrypted_subject_bytes):required_length]))

        
        try:
            decrypted_email = encrypted_email.copy()
            decrypted_email["subject"] = decrypted_subject_bytes.decode('utf-8')
            decrypted_email["body"] = decrypted_body_bytes.decode('utf-8')
        except UnicodeDecodeError:
            raise ValueError("Invalid ciphertext or wrong key: UTF-8 decoding failed")

        return decrypted_email

    except ValueError as e:
        raise
    except Exception as e:
        raise ValueError(f"Decryption failed: {str(e)}")
    
def encrypt_file(file_content, key):

    try:
        key_bytes = key.encode('utf-8')
        if len(key_bytes) < len(file_content):
            raise ValueError(f"Key too short: {len(key_bytes)} bytes, need {len(file_content)}")

        encrypted_data = bytes(a ^ b for a, b in zip(file_content, key_bytes[:len(file_content)]))
        
        return binascii.hexlify(encrypted_data).decode('utf-8')

    except Exception as e:
        raise ValueError(f"File encryption failed: {str(e)}")

def decrypt_file(encrypted_hex, key):

    try:
        
        try:
            encrypted_data = binascii.unhexlify(encrypted_hex)
        except binascii.Error:
            raise ValueError("Invalid file ciphertext: Hex decoding failed")

        
        key_bytes = key.encode('utf-8')
        if len(key_bytes) < len(encrypted_data):
            raise ValueError(f"Key too short: {len(key_bytes)} bytes, need {len(encrypted_data)}")

        
        decrypted_data = bytes(a ^ b for a, b in zip(encrypted_data, key_bytes[:len(encrypted_data)]))
        
        return decrypted_data

    except ValueError as e:
        raise
    except Exception as e:
        raise ValueError(f"File decryption failed: {str(e)}")