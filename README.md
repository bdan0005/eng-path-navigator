# eng-path-navigator

## Setup
1. Clone the repo
2. Run:
    ```
    cd backend
    python3 -m venv venv
    venv/bin/activate # OR venv/Scripts/activate depending on OS
    pip install -r requirements.txt

    cd ..
    cd frontend
    npm install
    ```

## Running the app
### Backend
```
cd backend
uvicorn main:app --reload
```
To access SwaggerUI, check %BASE_URL%/docs.

### Frontend
```
cd frontend
npm run start
```