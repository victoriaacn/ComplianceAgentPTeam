import os
import asyncio
import json
import re
from dotenv import load_dotenv
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from send_email import send_emails_for_processes  # Import the email-sending function

load_dotenv()

AZURE_PROJECT_CONNECTION_STRING = os.getenv("AZURE_PROJECT_CONNECTION_STRING")
AZURE_AUDIT_AGENT_ID = os.getenv("AZURE_AUDIT_AGENT_ID")

project_client = AIProjectClient.from_connection_string(
    credential=DefaultAzureCredential(),
    conn_str=AZURE_PROJECT_CONNECTION_STRING
)

agent = project_client.agents.get_agent(AZURE_AUDIT_AGENT_ID)

async def ask_audit_agent(question: str):
    """
    Ask the audit agent a question and retrieve the response.
    """
    try:
        # Create a new thread for the conversation
        thread = project_client.agents.create_thread()

        # Send the user's question to the agent
        project_client.agents.create_message(
            thread_id=thread.id,
            role="user",
            content=question
        )

        # Process the agent's response
        project_client.agents.create_and_process_run(
            thread_id=thread.id,
            agent_id=agent.id
        )

        # Retrieve all messages in the thread
        messages = project_client.agents.list_messages(thread_id=thread.id)

        # Filter assistant responses that are not just repeating the question
        assistant_responses = [
            msg["text"]["value"]
            for msg in messages.text_messages
            if msg["type"] == "text"
            and "text" in msg
            and "value" in msg["text"]
            and msg["text"]["value"].strip().lower() != question.strip().lower()
        ]

        return assistant_responses
    except Exception as e:
        print(f"Error while interacting with the audit agent: {e}")
        return None

def extract_json_from_response(response: str):
    """
    Extract the JSON portion from the agent's response.

    Args:
        response (str): The full response from the agent.

    Returns:
        dict: The extracted JSON object, or None if parsing fails.
    """
    try:
        # Use a regular expression to find the JSON portion
        json_match = re.search(r"\{.*\}", response, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            print("No JSON found in the response.")
            return None
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return None

async def perform_audit():
    """
    Perform an audit to identify non-compliant processes and notify employees.
    """
    try:
        print("Requesting the audit agent to retrieve non-compliant processes and emails...")
        question = (
            "Task: Retrieve non-compliant processes and emails.\n\n"
            "Please provide a list of all non-compliant processes and the email addresses of all employees associated with each non-compliant process. "
            "Return the data in JSON format."
        )

        # Ask the audit agent the question
        responses = await ask_audit_agent(question)

        if not responses:
            print("No response received from the audit agent.")
            return {"status": "error", "message": "No response received from the audit agent."}

        # Process the responses
        results = []
        for response in responses:
            print("Audit Agent Response:", response)

            # Extract the JSON portion from the response
            extracted_data = extract_json_from_response(response)
            if extracted_data and "processes" in extracted_data:
                processes = extracted_data["processes"]
                print("Extracted Processes:", processes)

                # Send emails for the processes
                email_results = send_emails_for_processes(processes)
                print("Email sending results:", email_results)

                results.append({"processes": processes, "email_results": email_results})
            else:
                print("Failed to extract processes from the response.")
                results.append({"status": "error", "message": "Failed to extract processes from the response."})

        return {"status": "success", "results": results}

    except Exception as e:
        print(f"Error during audit: {e}")
        return {"status": "error", "message": str(e)}

