# This is the main entry point for the FastAPI application.
# It sets up the FastAPI app, adds CORS middleware, and defines the API endpoints.
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ask_agent import ask_agent  # <- Import helper function from ask_agent.py
from audit import audit

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
def run_audit():
    try:
        # Call the updated audit function
        result = audit()

        # Check if the result contains an error
        if isinstance(result, dict) and "error" in result:
            return JSONResponse(status_code=400, content=result)

        # Return the successful result
        return {"response": result}
    except Exception as e:
        # Log the error and return a 500 Internal Server Error
        print(f"Error during audit: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "An unexpected error occurred during the audit process."}
        )