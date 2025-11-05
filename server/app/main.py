from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from services.qkd_service import generate_quantum_key
from services.encryption_service import encrypt_email, decrypt_email, encrypt_file, decrypt_file
from services.email_client import send_email
from services.store_mail import store_email_key 
from config.settings import PORT, MONGO_URI, JWT_SECRET
from pymongo import MongoClient
from bson import ObjectId
from io import BytesIO
from bson.binary import Binary
from werkzeug.utils import secure_filename
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

client = MongoClient(MONGO_URI) 
db = client["Email_Project"]
email = db["emails"] 

app = Flask(__name__)
# CORS(app, resources={r"/encrypt": {"origins": "http://localhost:5173"}})
app.config['JWT_SECRET_KEY'] = JWT_SECRET
jwt = JWTManager(app)

@app.route('/encrypt', methods=['POST'])
@jwt_required()
def send():
    try:
        email_data = request.form
        if not email_data or "body" not in email_data:
            return jsonify({"error": "Email data with body is required"}), 400
        
        sender_email = get_jwt_identity()
        if not sender_email:
            return jsonify({"error": "Invalid or missing sender identity"}), 401
        
        key_length = max(128, max(len(email_data["subject"].encode('utf-8')), len(email_data["body"].encode('utf-8'))) * 8)

        file = request.files.get('file')
        file_content = None
        file_name = None
        if file and file.filename:
            file_content = file.read()
            file_name = secure_filename(file.filename)
            key_length += len(file_content)
            print(f"File {file_name} received, size={len(file_content)} bytes, increasing key length to {key_length} bits")
        else:
            file_content = None
            file_name = None
            print("No file received, using only email body and subject for key generation")

        key, qber = generate_quantum_key(key_length)

        # print(f"Generated key of length {key} bytes, QBER: {qber}")
        print(f"Generated {key_length}‑bit key; QBER = {qber:.3%}")

        file_hex = None
        if file_content:


            
            file_name = secure_filename(file.filename)
            file_hex = encrypt_file(file_content, key)

        encrypted_email = encrypt_email(email_data, key)
        
        body_with_file = encrypted_email["body"]
        if file_hex:
            body_with_file += f"\n\nAttachment (hex): {file_hex[:50]}... (download via API)"
        # print(f"Sending email with ID: {email_id}, to: {email_data['to']}, subject: {encrypted_email['subject']}")
        result = send_email(
            encrypted_body=body_with_file,
            mail_from=sender_email,
            to=email_data["to"],
            subject=encrypted_email["subject"]
        )
        
        if result["status"] == "error":
            return jsonify({"error": result["error"]}), 500

        email_doc = store_email_key(email_data["to"], key, qber, encrypted_email, sender_email, file_name, file_hex)
        email_id = email_doc["email_id"]
        
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
@jwt_required()
def decrypt():
    try:
        data = request.get_json()
        email_id = data.get('_id')

        if not email_id:
            return jsonify({"error": "Email ID (_id) is required"}), 400

        try:
            email_id_obj = ObjectId(email_id)
        except Exception:
            return jsonify({"error": "Invalid email ID format"}), 400

        print(f"Decrypting email with ID: {email_id}")

        email_doc = email.find_one({"_id": email_id_obj})
        if not email_doc:
            return jsonify({"error": f"No email found with ID {email_id}"}), 404
        
        # print(f"Email document found: {email_doc}")

        encrypted_subject = email_doc.get("encrypted_subject")
        encrypted_body = email_doc.get("encrypted_body")
        key = email_doc.get("key")

        print(f"Key length: {len(key)} bytes")

        # Validate encrypted content
        if not (encrypted_subject and encrypted_body):
            return jsonify({"error": "Encrypted subject or body missing"}), 400

        # print(f"Encrypted subject length: {len(encrypted_subject)} hex characters, body length: {len(encrypted_body)} hex characters")

        decrypted_email = decrypt_email(
            {"subject": encrypted_subject, "body": encrypted_body},
            bytes(key)
        )

        email.update_one({"_id": email_id_obj}, {"$set": {"is_read": True}})

        file_info = {}
        if email_doc.get("file_hex"):
            file_info = {
                "file_name": email_doc.get("file_name"),
                "email_id": str(email_id_obj)
            }

        return jsonify({
            "message": "Decryption successful",
            "status": "success",
            "email_id": str(email_id),
            "decryptedContent": {
                "decrypted_subject": decrypted_email["subject"],
                "decrypted_body": decrypted_email["body"],
                "file": file_info
            }
        }), 200

    except Exception as e:
        print("Decryption error:", str(e))
        return jsonify({"error": str(e)}), 500

    
@app.route('/download/<email_id>', methods=['GET'])
def download_file(email_id):
    try:
        try:
            email_obj_id = ObjectId(email_id)
        except Exception:
            return jsonify({"error": "Invalid email ID format"}), 400

        email_doc = db["emails"].find_one({"_id": email_obj_id})
        if not email_doc or not email_doc.get("file_hex"):
            return jsonify({"error": "No file found for this email"}), 404

        key = email_doc["key"]
        print(f"Key length: {len(key)} bytes")
        
        decrypted_file = decrypt_file(email_doc["file_hex"], key)
        if not decrypted_file:
            return jsonify({"error": "File decryption failed"}), 500
        print(f"Decrypted file size: {len(decrypted_file)} bytes")

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