import os
import base64
import requests
import json
import re
from dotenv import load_dotenv
from email_agent import ask_email_agent  # Import the email agent function

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

    Returns:
        tuple: (bool, str) - A tuple where the first value indicates success (True/False),
               and the second value is an error message or None if successful.
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
            return True, None  # Email sent successfully
        else:
            print(f"Failed to send email. Status code: {response.status_code}, Response: {response.text}")
            return False, f"Failed to send email. Status code: {response.status_code}, Response: {response.text}"
    except Exception as e:
        print(f"An error occurred while sending email to {to}: {e}")
        return False, str(e)  # Return failure and the error message

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
            f"Ensure the email is professional, includes a proposed meeting invite with two real dates and times for mandatory training or discussion, "
            f"and is signed as 'Audit Agent Einstein'. Use the following structured output:\n"
            f"- **Email Subject:** [Single-line subject]\n"
            f"- **Email Body:** [Multi-line body including meeting details]\n\n"
            f"The email body should include the following:\n"
            f"1. A greeting addressing the recipient by name (use {{name}} as a placeholder).\n"
            f"2. A description of the non-compliance issue related to the process '{process}'.\n"
            f"3. A statement that mandatory training or a discussion is required.\n"
            f"4. Two proposed meeting dates and times (e.g., 'May 20, 2025, at 1:00 PM' and 'May 22, 2025, at 3:00 PM').\n"
            f"5. A closing statement encouraging the recipient to attend one of the meetings.\n"
            f"6. A signature as 'Audit Agent Einstein'."
        )
        response = ask_email_agent(question)  # Call the agent to generate the content

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
        processes (dict): A dictionary where keys are process names and values are lists of recipient objects
                          (each containing "name" and "email").

    Returns:
        dict: A dictionary where keys are process names and values are lists of email results.
    """
    results = {}
    for process, recipients in processes.items():
        try:
            # Generate email content
            subject, body_template = generate_email_content(process)

            for recipient in recipients:
                try:
                    # Ensure recipient has a name or use a default
                    recipient_name = recipient.get("name", "Valued Employee")
                    if "name" not in recipient:
                        print(f"Warning: Recipient {recipient['email']} is missing a name. Using default 'Valued Employee'.")

                    # Personalize the email body with the recipient's name
                    personalized_body = body_template.replace("{name}", recipient_name)

                    # Send the email
                    success, error = send_email(recipient["email"], subject, personalized_body)
                    if success:
                        results[process] = results.get(process, []) + [f"Success: {recipient['email']}"]
                    else:
                        results[process] = results.get(process, []) + [f"Failed: {recipient['email']}, Error: {error}"]
                except Exception as e:
                    results[process] = results.get(process, []) + [f"Failed: {recipient['email']}, Error: {str(e)}"]
        except Exception as e:
            results[process] = f"Failed to generate email content for process {process}, Error: {str(e)}"

    return results