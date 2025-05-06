import os
from dotenv import load_dotenv
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from employee_mapper import map_employees_to_noncompliant_processes

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
                    "Identify all non-compliant business processes from the policies categorized by risk. Return only the Process IDs, grouped by risk categories: High Risk, Medium Risk, Low Risk. Do not include any other details or descriptions."
            )
        )
        print("Thread Created:", thread.id)
        print("Message Sent to Agent")
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
                print("Raw Response from Agent:", response)
                # If there's a response, process it
                if response:
                    # Split the response into categories
                    categories = {"High Risk": [], "Medium Risk": [], "Low Risk": []}
                    lines = response.split('\n')

                    current_category = None
                    for line in lines:
                        line = line.strip()
                        
                        if line.startswith("-"):
                            line = line[1:].strip()  # Remove leading dash and whitespace
                        if "High Risk" in line:
                            current_category = "High Risk"
                        elif "Medium Risk" in line:
                            current_category = "Medium Risk"
                        elif "Low Risk" in line:
                            current_category = "Low Risk"
                        elif line.startswith("Process"):
                            if current_category:
                                process_id = line.split(":")[0].strip()  # Extract Process ID
                                categories[current_category].append(process_id)

                    # Print the categories (this is where you can check the output)
                    print("Categorized Processes:", categories)
                    return categories

        # If no valid response is found, return an error message
        return {"error": "No valid response received from the agent."}
    except Exception as e:
        # Log the error and return it for debugging
        print(f"Error in audit function: {e}")
        return {"error": str(e)}

# Call the function directly to test the output
if __name__ == "__main__":
    result = audit()
    print("Audit Result:", result)
    
CSV_PATH = "data/Employee_Directory_Internal_Emails.csv"
resultemp = map_employees_to_noncompliant_processes(result, CSV_PATH)
print("Employee Mapping Result:", resultemp)