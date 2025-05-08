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

        # Check if the response contains results
        if results["status"] != "success" or not results.get("results"):
            return JSONResponse(
                status_code=500,
                content={"error": results.get("message", "Unknown error occurred during the audit.")}
            )

        # Flatten processes and email_results if there are multiple results
        processes = {}
        email_results = {}

        for result in results["results"]:
            # Merge processes
            for process, employees in result.get("processes", {}).items():
                if process not in processes:
                    processes[process] = []
                processes[process].extend(employees)

            # Merge email results
            for process, email_statuses in result.get("email_results", {}).items():
                if process not in email_results:
                    email_results[process] = []
                email_results[process].extend(email_statuses)

        # Return the flattened structure
        return {"processes": processes, "email_results": email_results}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

