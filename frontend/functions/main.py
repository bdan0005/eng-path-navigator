import functions_framework
import requests
import json
from firebase_functions import https_fn
from firebase_admin import initialize_app

# --- Configuration ---
# IMPORTANT: Replace this placeholder with the actual URL of your deployed Google Apps Script web app (the one that accepts POST requests).
GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwmffy3T8ljqaM8Q5oydakpagMy3olMTf2vqfQkDtGSvs1m6fZpyTYtDWfxkDKDDp6l/exec"
# --- End Configuration ---


# Initialize the Firebase app
# This is necessary if you plan to use other Firebase services (like Firestore or Auth)
# but is often optional for simple HTTP functions. It's good practice to keep it.
initialize_app()

# FIX: Removed all arguments from the decorator. We rely on the manual CORS handling
# implemented inside the function body below to manage preflight and response headers.
@https_fn.on_request()
def send_to_sheet(req: https_fn.Request) -> https_fn.Response:
    """
    Handles an incoming HTTP POST request, validates it, and proxies the
    JSON body to a predefined Google Apps Script URL. Also handles CORS preflight.
    """

    # Define standard CORS response headers
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "3600" # Cache preflight for 1 hour
    }

    # Handle preflight CORS (OPTIONS method)
    if req.method == "OPTIONS":
        return https_fn.Response("", status=204, headers=cors_headers)

    # 1. Method Check (Standard POST check for actual data)
    if req.method != "POST":
        return https_fn.Response("Method Not Allowed", status=405, headers=cors_headers)

    try:
        # 2. Extract Data
        # req.get_json(silent=True) safely parses the JSON body.
        data = req.get_json(silent=True)

        if not data:
            raise ValueError("Request body must be valid JSON.")

        print(f"Received data: {data}")

        # 3. Forward the request to the Google Script URL
        sheet_response = requests.post(
            GOOGLE_SCRIPT_URL,
            json=data,
            headers={"Content-Type": "application/json"}
        )

        # 4. Check for successful response from the Google Script
        sheet_response.raise_for_status() # Raises an exception for HTTP error codes (4xx or 5xx)

        # 5. Send the result back to the original client
        # Note: We must explicitly add the ACAO header to the final response as well.
        return https_fn.Response(
            sheet_response.text,
            status=200,
            headers={"Access-Control-Allow-Origin": "*"}
        )

    except ValueError as e:
        # Handle JSON parsing errors or missing data
        print(f"Data error: {e}")
        return https_fn.Response(f"Bad Request: {e}", status=400, headers=cors_headers)

    except requests.exceptions.RequestException as e:
        # Handle errors related to the outbound request
        print(f"Outbound request failed: {e}")
        return https_fn.Response("Internal Server Error: Failed to reach Google Script.", status=500, headers=cors_headers)

    except Exception as e:
        # Handle all other unexpected errors
        print(f"An unexpected error occurred: {e}")
        return https_fn.Response(f"Internal Server Error: {e}", status=500, headers=cors_headers)
