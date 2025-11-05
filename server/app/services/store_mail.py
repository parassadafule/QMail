import pymongo
from bson.binary import Binary
from datetime import datetime, timezone

from config.settings import MONGO_URI  

try:
    client = pymongo.MongoClient(MONGO_URI)
    db = client["Email_Project"]  
    keys_collection = db["email_keys"]  
    
except Exception as e:   
    raise

def get_next_email_id():
    counters_collection = db["counters"]
    result = counters_collection.find_one_and_update(
        {"_id": "email_id"},
        {"$inc": {"sequence": 1}},
        upsert=True,
        return_document=pymongo.ReturnDocument.AFTER
    )
    return result["sequence"]

def store_email_key(to_email, key, qber, encrypted_email, sender_email, file_name, file_hex):

    try:
        
        email_id = get_next_email_id()
        email_doc = {
            "email_id": email_id,
            "sender": sender_email,
            "to": to_email,
            "encrypted_subject": encrypted_email["subject"],
            "encrypted_body": encrypted_email["body"],
            "file_name": file_name,
            "file_hex": file_hex,
            "key": Binary(key),
            "qber": qber,
            "is_read": False,
            "created_at" : datetime.now(timezone.utc)
        }
        email_data = db["emails"]
        result = email_data.insert_one(email_doc)
        
        email_doc["_id"] = str(result.inserted_id)
        return email_doc
    except Exception as e:
        
        raise

def retrieve_email_key(to_email):
    
    try:
        key_doc = keys_collection.find_one({"to_email": to_email})
        if key_doc:
            key_doc["_id"] = str(key_doc["_id"])
            
            return key_doc
        else:
            
            return None
    except Exception as e:
        
        raise
    
def mark_email_as_read(email_id):

    try:
        result = keys_collection.update_one(
            {"email_id": email_id},
            {"$set": {"is_read": True}}
        )
        
        
    except Exception as e:
        
        raise