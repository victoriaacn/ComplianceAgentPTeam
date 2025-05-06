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
        to (list): List of recipient email addresses.
        subject (str): Email subject.
        body (str): Email body.
        file_path (str, optional): Path to a file to attach. Defaults to None.
    """
    try:
        # Prepare the payload
        payload = {
            "To": ", ".join(to), # List of recipients
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

        print(f"Sending email to: {', '.join(to)}")
        # Send the POST request
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        response = requests.post(f"{EMAIL_HOST}/send-email/", json=payload, headers=headers)

        # Handle the response
        if response.status_code == 200:
            print(f"Email sent successfully to: {', '.join(to)}")
        else:
            print(f"Failed to send email. Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        print(f"An error occurred: {e}")

def send_emails_for_processes(processes):
    """
    Sends emails to all recipients for each non-compliant process.

    Args:
        processes (dict): A dictionary where keys are process names and values are lists of email addresses.
    """
    results = {}
    for process, recipients in processes.items():
        subject = f"Action Required: Non-Compliant Process - {process}"
        body = f"""
        Dear Team,

        The following process has been identified as non-compliant: {process}.
        Please review the relevant policies and take corrective actions.

        Best regards,
        Compliance Team
        """
        try:
            send_email(recipients, subject, body)
            results[process] = "Success"
        except Exception as e:
            results[process] = f"Failed: {str(e)}"

    return results