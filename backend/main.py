from fastapi import FastAPI
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

AZURE_PROJECT_CONNECTION_STRING = os.getenv("AZURE_PROJECT_CONNECTION_STRING")
AZURE_AGENT_ID = os.getenv("AZURE_AGENT_ID")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

project_client = AIProjectClient.from_connection_string(
    credential=DefaultAzureCredential(),
    conn_str=AZURE_PROJECT_CONNECTION_STRING
)

agent = project_client.agents.get_agent(AZURE_AGENT_ID)

@app.get("/")
def read_root():
    return {"message": "Hello! The compliance agent is running."}


@app.get("/ask")
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
    print(messages.text_messages)
    
    #Creating a list of all the assistant's messages (extracting 'value' from the response)
    assistant_responses = [
        msg["text"]["value"] for msg in messages.text_messages
        if msg["type"] == "text" and "text" in msg and "value" in msg["text"]
    ]
    return {"response": assistant_responses}


