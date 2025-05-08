# This script is used to ask a question to the Azure AI email agent and get the response.
import os
from dotenv import load_dotenv
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

load_dotenv()

AZURE_PROJECT_CONNECTION_STRING = os.getenv("AZURE_PROJECT_CONNECTION_STRING")
AZURE_EMAIL_AGENT_ID = os.getenv("AZURE_EMAIL_AGENT_ID")

email_project_client = AIProjectClient.from_connection_string(
    credential=DefaultAzureCredential(),
    conn_str=AZURE_PROJECT_CONNECTION_STRING
)

email_agent = email_project_client.agents.get_agent(AZURE_EMAIL_AGENT_ID)

def ask_email_agent(question: str):
    """
    Sends a question to the Azure AI email agent and retrieves the response.

    Args:
        question (str): The question to ask the email agent.

    Returns:
        list: A list of responses from the email agent.
    """
    thread = email_project_client.agents.create_thread()
    email_project_client.agents.create_message(
        thread_id=thread.id,
        role="user",
        content=question
    )
    email_project_client.agents.create_and_process_run(
        thread_id=thread.id,
        agent_id=email_agent.id
    )

    messages = email_project_client.agents.list_messages(thread_id=thread.id)

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