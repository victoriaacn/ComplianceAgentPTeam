import os
import base64
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST")

def send_email(to, subject, body, file_path=None):
    """
    Sends an email using the provided host address.

    Args:
        to (str): Recipient email address.
        subject (str): Email subject.
        body (str): Email body.
        file_path (str, optional): Path to a file to attach. Defaults to None.
    """
    try:
        # Prepare the payload
        payload = {
            "To": to,
            "Subject": subject,
            "Body": body
        }

        # If a file is provided, encode it in base64 and include it in the payload
        if file_path:
            with open(file_path, "rb") as file:
                file_base64 = base64.b64encode(file.read()).decode('utf-8')
                payload.update({
                    "filename": os.path.basename(file_path),
                    "fileBase64": file_base64
                })
        print(f"Sending email to: {EMAIL_HOST}")
        # Send the POST request
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        response = requests.post(f"{EMAIL_HOST}/send-email/", json=payload, headers=headers)

        # Handle the response
        if response.status_code == 200:
            print("Email sent successfully!")
        else:
            print(f"Failed to send email. Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__": 
    # Input parameters for testing
    to = "victoria.de.alba@accenture.com"  # Replace with your email for testing
    subject = "Test Email"
    body = "This is a test email sent using the SendEmail ACS service."
    file_path = None  # Set a file path if you want to attach a file

    # Send the email
    send_email(to, subject, body, file_path)