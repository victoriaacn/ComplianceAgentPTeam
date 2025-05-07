# This is the main entry point for the FastAPI application.
# It sets up the FastAPI app, adds CORS middleware, and defines the API endpoints.
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ask_agent import ask_agent  
from audit import perform_audit  # Import the perform_audit function
import asyncio

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

@app.get("/audit")
async def audit():
    try:
        # Call the perform_audit function
        results = await perform_audit()
        # Extract processes and email_results from the nested structure
        processes = results["results"][0]["processes"]
        email_results = results["results"][0]["email_results"]
        return {"processes": processes, "email_results": email_results}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

