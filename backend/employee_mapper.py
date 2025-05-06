import csv
from collections import defaultdict

def map_employees_to_noncompliant_processes(audit_result, csv_path):
    """
    Maps employees to non-compliant processes based on the audit result.

    Args:
        audit_result (dict): The result of the audit containing processes grouped by risk levels.
        csv_path (str): Path to the CSV file containing employee data.

    Returns:
        dict: A mapping of process IDs to employee details and associated risk levels.
    """
    employee_process_map = defaultdict(list)

    # Open the CSV file and read employee data
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            employee_name = row["Name"]
            email = row["Email"]
            raw_processes = row["Processes Involved"]

            # Skip rows without processes
            if not raw_processes:
                continue

            # Normalize and split processes
            processes = [p.strip() for p in raw_processes.replace(',', ';').split(';')]

            # Map processes to employees and risk levels
            for process_id in processes:
                for risk_level, processes_in_risk in audit_result.items():
                    if process_id in processes_in_risk:
                        employee_process_map[process_id].append({
                            "name": employee_name,
                            "email": email,
                            "risk": risk_level
                        })

    return employee_process_map