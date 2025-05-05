import csv
import os
from dotenv import load_dotenv
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

load_dotenv()

AZURE_PROJECT_CONNECTION_STRING = os.getenv("AZURE_PROJECT_CONNECTION_STRING")
AZURE_AUDIT_AGENT_ID = os.getenv("AZURE_AUDIT_AGENT_ID")
CSV_PATH = "backend/data/Employee_Directory_Internal_Emails.csv"

project_client = AIProjectClient.from_connection_string(
    credential=DefaultAzureCredential(),
    conn_str=AZURE_PROJECT_CONNECTION_STRING
)

agent = project_client.agents.get_agent(AZURE_AUDIT_AGENT_ID)


def audit():
    try:
        # Create a thread
        thread = project_client.agents.create_thread()

        # Send a message to the agent
        project_client.agents.create_message(
            thread_id=thread.id,
            role="user",
            content=(
                "Identify all non-compliant business processes from the policies categorized by risk."
            )
        )

        # Process the thread with the agent
        project_client.agents.create_and_process_run(
            thread_id=thread.id,
            agent_id=agent.id
        )

        # Retrieve the messages from the thread
        messages = project_client.agents.list_messages(thread_id=thread.id)

        # Extract and return the first valid response from the agent
        for msg in messages.text_messages:
            if msg["type"] == "text" and "text" in msg and "value" in msg["text"]:
                response = msg["text"]["value"].strip()
                if response:
                    return response

        # If no valid response is found, return an error message
        return {"error": "No valid response received from the agent."}
    except Exception as e:
        # Log the error and return it for debugging
        print(f"Error in audit function: {e}")
        return {"error": str(e)}