import functions_framework
import requests
import json
from firebase_functions import https_fn
from firebase_admin import initialize_app

# --- Configuration ---
# IMPORTANT: Replace this placeholder with the actual URL of your deployed Google Apps Script web app (the one that accepts POST requests).
GOOGLE_SCRIPT_URL = "https://script.google.com/a/macros/student.monash.edu/s/AKfycbzaL-1e1Ud72_4xmpZjLeGHxPVys4Pf-EgGr7wwhkejcH3TK55hsKAwIdXMTnNHcO6c/exec"
# --- End Configuration ---


# Initialize the Firebase app
# This is necessary if you plan to use other Firebase services (like Firestore or Auth)
# but is often optional for simple HTTP functions. It's good practice to keep it.
initialize_app()

# FIX: Removed HttpsOptions entirely and replaced with `cors=True` to enable wildcard CORS,
# which resolves the TypeError related to unexpected keyword arguments.
@https_fn.on_request(cors=True)
def send_to_sheet(req: https_fn.Request) -> https_fn.Response:
    """
    Handles an incoming HTTP POST request, validates it, and proxies the
    JSON body to a predefined Google Apps Script URL.
    """

    # 1. Method Check
    if req.method != "POST":
        print(f"Received invalid method: {req.method}. Must be POST.")
        # Return HTTP 405 Method Not Allowed
        return https_fn.Response("Method Not Allowed", status=405)

    try:
        # 2. Extract Data
        # req.get_json(silent=True) safely parses the JSON body.
        data = req.get_json(silent=True)

        if not data:
            raise ValueError("Request body must be valid JSON.")

        print(f"Received data: {data}")

        # 3. Forward the request to the Google Script URL
        # The 'requests' library automatically serializes the 'json' parameter.
        sheet_response = requests.post(
            GOOGLE_SCRIPT_URL,
            json=data,
            headers={"Content-Type": "application/json"}
        )

        # 4. Check for successful response from the Google Script
        sheet_response.raise_for_status() # Raises an exception for HTTP error codes (4xx or 5xx)

        # 5. Send the result back to the original client
        return https_fn.Response(sheet_response.text, status=200)

    except ValueError as e:
        # Handle JSON parsing errors or missing data
        print(f"Data error: {e}")
        return https_fn.Response(f"Bad Request: {e}", status=400)

    except requests.exceptions.RequestException as e:
        # Handle errors related to the outbound request (e.g., DNS failure, 5xx from target)
        print(f"Outbound request failed: {e}")
        return https_fn.Response("Internal Server Error: Failed to reach Google Script.", status=500)

    except Exception as e:
        # Handle all other unexpected errors
        print(f"An unexpected error occurred: {e}")
        return https_fn.Response(f"Internal Server Error: {e}", status=500)
