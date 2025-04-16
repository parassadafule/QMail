import smtplib
from email.mime.text import MIMEText

from config.settings import GMAIL_USER, GMAIL_PASSWORD

def send_email(encrypted_body, to=None, subject=None):
    try:
        recipient = to if to else "receiver@example.com"
        email_subject = subject if subject else "Quantum Secure Email"
        msg = MIMEText(encrypted_body)
        msg['Subject'] = email_subject
        msg['From'] = GMAIL_USER
        msg['To'] = recipient
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(GMAIL_USER, GMAIL_PASSWORD)
            server.send_message(msg)
        
        return {
            "status": "sent",
            "to": recipient,
            "subject": email_subject,
            "encrypted_body": encrypted_body
        }
    except smtplib.SMTPException as e:
        
        return {"status": "error", "error": f"SMTP error: {str(e)}"}
    except Exception as e:
        
        return {"status": "error", "error": str(e)}