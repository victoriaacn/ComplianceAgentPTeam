import os
import asyncio
from dotenv import load_dotenv
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

load_dotenv()

AZURE_PROJECT_CONNECTION_STRING = os.getenv("AZURE_PROJECT_CONNECTION_STRING")
AZURE_AUDIT_AGENT_ID = os.getenv("AZURE_AUDIT_AGENT_ID")

project_client = AIProjectClient.from_connection_string(
    credential=DefaultAzureCredential(),
    conn_str=AZURE_PROJECT_CONNECTION_STRING
)

agent = project_client.agents.get_agent(AZURE_AUDIT_AGENT_ID)

async def test_get_noncompliant_processes_and_emails():
    """
    Test the agent's ability to retrieve non-compliant processes and emails.
    """
    try:
        print("Testing agent task: get_noncompliant_processes_and_emails...")
        prompt = (
            "Task: Retrieve non-compliant processes and emails.\n\n"
            "Please provide a list of non-compliant processes and the email addresses of employees associated with each process. "
            "Return the data in JSON format."
        )
        response = await agent.chat(prompt)  # Assuming the agent uses a conversational method like `chat`
        print("Agent response:", response)
    except Exception as e:
        print("Error while testing agent task:", e)

if __name__ == "__main__":
    asyncio.run(test_get_noncompliant_processes_and_emails())