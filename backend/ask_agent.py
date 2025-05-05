# This script is used to ask a question to the Azure AI agent and get the response.
import os
from dotenv import load_dotenv
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

load_dotenv()

AZURE_PROJECT_CONNECTION_STRING = os.getenv("AZURE_PROJECT_CONNECTION_STRING")
AZURE_AGENT_ID = os.getenv("AZURE_AGENT_ID")

project_client = AIProjectClient.from_connection_string(
    credential=DefaultAzureCredential(),
    conn_str=AZURE_PROJECT_CONNECTION_STRING
)

agent = project_client.agents.get_agent(AZURE_AGENT_ID)

def ask_agent(question: str):
    thread = project_client.agents.create_thread()
    project_client.agents.create_message(
        thread_id=thread.id,
        role="user",
        content=question
    )
    project_client.agents.create_and_process_run(
        thread_id=thread.id,
        agent_id=agent.id
    )

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
