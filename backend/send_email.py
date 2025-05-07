import os
import base64
import requests
import json
import re
from dotenv import load_dotenv
from ask_agent import ask_agent  # Import the ask_agent function

# Load environment variables
load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST")

def send_email(to, subject, body, file_path=None):
    """
    Sends an email using the provided host address.

    Args:
        to (str): A single recipient email address as a string.
        subject (str): Email subject.
        body (str): Email body (plain text).
        file_path (str, optional): Path to a file to attach. Defaults to None.
    """
    try:
        # Ensure 'to' is a string
        if not isinstance(to, str):
            raise ValueError("The 'to' parameter must be a single email address as a string.")

        # Prepare the payload
        payload = {
            "To": to,
            "Subject": subject,
            "Body": body  # Plain text version
        }

        # If a file is provided, encode it in base64 and include it in the payload
        if file_path:
            with open(file_path, "rb") as file:
                file_base64 = base64.b64encode(file.read()).decode('utf-8')
                payload.update({
                    "filename": os.path.basename(file_path),
                    "fileBase64": file_base64
                })

        print(f"Sending email to: {to}")
        # Send the POST request
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        response = requests.post(f"{EMAIL_HOST}/send-email/", json=payload, headers=headers)

        # Handle the response
        if response.status_code == 200:
            print(f"Email sent successfully to: {to}")
        else:
            print(f"Failed to send email. Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        print(f"An error occurred while sending email to {to}: {e}")

def extract_json_from_response(response):
    """
    Extracts the email subject and body from the agent's response.

    Args:
        response (str): The full response from the agent.

    Returns:
        dict: A dictionary containing the extracted subject and body.
    """
    try:
        # Use regular expressions to extract the subject and body
        subject_match = re.search(r"\*\*Email Subject:\*\* (.+)", response)
        body_match = re.search(r"\*\*Email Body:\*\*\n(.+)", response, re.DOTALL)

        subject = subject_match.group(1).strip() if subject_match else None
        body = body_match.group(1).strip() if body_match else None

        if not subject or not body:
            raise ValueError("Missing subject or body in the agent's response.")

        return {
            "subject": subject,
            "body": body
        }
    except Exception as e:
        print(f"Error extracting content from response: {e}")
        return None

def generate_email_content(process):
    """
    Generates the email subject and body using the agent.

    Args:
        process (str): The name of the non-compliant process.

    Returns:
        tuple: A tuple containing the subject and body.
    """
    try:
        # Use the agent to generate the email content
        question = (
            f"Generate an email subject and body for the non-compliant process: {process}. "
            f"Ensure the email is professional, includes a proposed meeting invite with time, date and location as Teams Invite and signed as 'Audit Agent Einstein'. "
            f"Provide the following structured output:\n"
            f"- **Email Subject:** [Single-line subject]\n"
            f"- **Email Body:** [Multi-line body]"
        )
        response = ask_agent(question)  # Call the agent to generate the content

        # Log the raw response for debugging
        print("Raw Agent Response:", response)

        # Handle the case where the response is a list
        if isinstance(response, list):
            if len(response) > 0:
                response = response[0]  # Use the first response in the list
            else:
                raise ValueError("Agent returned an empty list of responses.")

        # Parse the response (assuming the agent returns structured text)
        content = extract_json_from_response(response)
        if not content:
            raise ValueError("Failed to extract JSON content from the agent's response.")

        return content["subject"], content["body"]
    except Exception as e:
        print(f"Error generating email content for process {process}: {e}")
        raise

def send_emails_for_processes(processes):
    """
    Sends individual emails to all recipients for each non-compliant process.

    Args:
        processes (dict): A dictionary where keys are process names and values are lists of email addresses.
    """
    results = {}
    for process, recipients in processes.items():
        try:
            # Generate email content
            subject, body = generate_email_content(process)

            for recipient in recipients:
                try:
                    send_email(recipient, subject, body)  # Send email
                    results[process] = results.get(process, []) + [f"Success: {recipient}"]
                except Exception as e:
                    results[process] = results.get(process, []) + [f"Failed: {recipient}, Error: {str(e)}"]
        except Exception as e:
            results[process] = f"Failed to generate email content for process {process}, Error: {str(e)}"

    return results