# This is the main entry point for the FastAPI application.
# It sets up the FastAPI app, adds CORS middleware, and defines the API endpoints.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ask_agent import ask_agent  # <- Import helper function from ask_agent.py

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello! The compliance agent is running."}

@app.get("/ask")
def ask(question: str):
    response = ask_agent(question)
    return {"response": response}
