# import smtplib
# from email.mime.text import MIMEText

# from config.settings import GMAIL_USER, GMAIL_PASSWORD

# def send_email(encrypted_body, mail_from, to=None, subject=None):
#     try:
#         recipient = to if to else "receiver@example.com"
#         email_subject = subject if subject else "Quantum Secure Email"
#         msg = MIMEText(encrypted_body)
#         msg['Subject'] = email_subject
#         msg['From'] = mail_from
#         msg['To'] = recipient
#         with smtplib.SMTP('smtp.gmail.com', 587) as server:
#             server.starttls()
#             server.login(GMAIL_USER, GMAIL_PASSWORD)
#             server.send_message(msg)
        
#         return {
#             "status": "sent",
#             "from": mail_from,
#             "to": recipient,
#             "subject": email_subject,
#             "encrypted_body": encrypted_body
#         }
#     except smtplib.SMTPException as e:
        
#         return {"status": "error", "error": f"SMTP error: {str(e)}"}
#     except Exception as e:
        
#         return {"status": "error", "error": str(e)}

import smtplib
from email.mime.text import MIMEText
from pymongo import MongoClient
from config.settings import MONGO_URI, SERVER_IP

def send_email(mail_from, encrypted_body, to=None, subject=None):
    try:

        recipient = to if to else "receiver@example.com"
        email_subject = subject if subject else "Quantum Secure Email"
        msg = MIMEText(encrypted_body)
        msg['Subject'] = email_subject
        msg['From'] = mail_from
        msg['To'] = recipient

        smtp_port = 25
        with smtplib.SMTP(SERVER_IP, smtp_port, timeout=20) as server:
            server.send_message(msg)

        return {
            "status": "sent",
            "from": mail_from,
            "to": recipient,
            "subject": email_subject,
            "encrypted_body": encrypted_body
        }

    except smtplib.SMTPException as e:
        return {"status": "error", "error": f"SMTP error: {str(e)}"}
    except Exception as e:
        return {"status": "error", "error": str(e)}
