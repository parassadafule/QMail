from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from services.qkd_service import generate_quantum_key
from services.encryption_service import encrypt_email, decrypt_email, encrypt_file, decrypt_file
from services.email_client import send_email
from services.store_mail import store_email_key 
from config.settings import PORT, GOOGLE_SECRET_KEY, MONGO_URI
from pymongo import MongoClient
from bson import ObjectId
from io import BytesIO

import json

client = MongoClient(MONGO_URI) 
db = client["Email_Project"]
email = db["email"] 

app = Flask(__name__)
CORS(app)  
app.config['SECRET_KEY'] = GOOGLE_SECRET_KEY

sender_email = "parassadafule21@gmail.com"


@app.route('/send', methods=['POST'])
def send():
    
    try:
        email_data = request.form
        if not email_data or "body" not in email_data:
            
            return jsonify({"error": "Email data with body is required"}), 400
        
        key_length = max(128, max(len(email_data["subject"].encode('utf-8')),len(email_data["body"].encode('utf-8'))) * 8)
        file = request.files.get('file')
        file_content = None
        file_name = None
        if file:
            file_content = file.read()
            key_length += len(file_content)

        key, qber = generate_quantum_key(key_length=key_length, eavesdropping=False)

        file_hex = None
        file_key_offset = len(email_data["subject"].encode('utf-8')) + len(email_data["body"].encode('utf-8'))
        if file:
            file_name = file.filename
            file_hex = encrypt_file(file_content, key[file_key_offset:])

        encrypted_email = encrypt_email(email_data, key)
        email_doc = store_email_key(email_data["to"], key, qber, encrypted_email, sender_email, file_name, file_hex)
        email_id = email_doc["email_id"]
        
        body_with_file = encrypted_email["body"]
        if file_hex:
            body_with_file += f"\n\nAttachment (hex): {file_hex[:50]}... (download via API)"
        result = send_email(
            encrypted_body=body_with_file,
            to=email_data["to"],
            subject=encrypted_email["subject"]
        )
        
        if result["status"] == "error":
            
            return jsonify({"error": result["error"]}), 500
        
        response_with_key = {
            "encrypted_email": encrypted_email,
            "qber": qber,
            "status": result["status"],
            "email_id": email_id,
            "file_name": file_name
        }
        
        return jsonify(response_with_key), 200
    
    except Exception as e:
        
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/decrypt', methods=['POST'])
def decrypt():
    try:
        data = request.json
        email_id = data.get('_id')  
        if not email_id:
            return jsonify({"error": "Email ID (_id) is required"}), 400

        try:
            email_id = ObjectId(email_id)
        except Exception:
            return jsonify({"error": "Invalid email ID format"}), 400

        email_doc = email.find_one({"_id": email_id})

        if not email_doc:
            return jsonify({"error": f"No email found with ID {email_id}"}), 404

        encrypted_email = {
            "subject": email_doc["encrypted_subject"],
            "body": email_doc["encrypted_body"]
        }
        key = email_doc["key"]

        decrypted_email = decrypt_email(encrypted_email, key)

        email.update_one({"_id": email_id}, {"$set": {"is_read": True}})

        # Include file info
        file_info = {}
        if email_doc.get("file_hex"):
            file_info = {"file_name": email_doc["file_name"], "email_id": str(email_id)}

        return jsonify({
            "decrypted_subject": decrypted_email["subject"],
            "decrypted_body": decrypted_email["body"],
            "file": file_info
        }), 200

    except Exception as e:
        
        return jsonify({"error": str(e)}), 500

@app.route('/sent', methods=['GET'])
def get_sent_emails():
    try:
        sent_emails = list(email.find({"sender": sender_email}, {"_id": 0}))
        
        return jsonify({"sent_emails": sent_emails}), 200
    except Exception as e:
        
        return jsonify({"error": str(e)}), 500

@app.route('/inbox', methods=['GET'])
def get_inbox_emails():
    try:
        receiver_email = request.args.get('email') 
        if not receiver_email:
            return jsonify({"error": "Receiver email is required"}), 400
        inbox_emails = list(email.find({"to": receiver_email}, {"_id": 0}))
        return jsonify({"inbox_emails": inbox_emails}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
    
@app.route('/download/<email_id>', methods=['GET'])
def download_file(email_id):

    try:
        try:
            email_id = ObjectId(email_id)
        except Exception:
            return jsonify({"error": "Invalid email ID format"}), 400

        email_doc = email.find_one({"_id": email_id})
        if not email_doc or not email_doc.get("file_hex"):
            return jsonify({"error": "No file found for this email"}), 404

        # Retrieve key
        key = email_doc["key"]
        
        # Decrypt file
        file_key_offset = len(email_doc["encrypted_subject"]) // 2 + len(email_doc["encrypted_body"]) // 2
        decrypted_file = decrypt_file(email_doc["file_hex"], key[file_key_offset:])
        
        # Serve file
        return send_file(
            BytesIO(decrypted_file),
            download_name=email_doc["file_name"],
            as_attachment=True
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Quantum Email Client API is running"}), 200

if __name__ == "__main__":
    
    app.run(port=PORT, debug=True)