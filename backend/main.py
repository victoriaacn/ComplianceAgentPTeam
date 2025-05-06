# This is the main entry point for the FastAPI application.
# It sets up the FastAPI app, adds CORS middleware, and defines the API endpoints.
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

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
    from ask_agent import ask_agent  # <- Lazy import to avoid circular dependency
    response = ask_agent(question)
    return {"response": response}

