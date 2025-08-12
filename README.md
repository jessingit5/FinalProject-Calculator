
Clone the Repository
Open your terminal, navigate to where you want to store the project, and run:

Bash

git clone <your-repository-url>
cd <repository-directory>

Create the Environment File
This file stores necessary passwords and keys. Copy the example file to create your local version
cp .env.example .env

Build and Run the Application 🚀
This single command builds the app's Docker image and starts all services (the web server and the database).
docker compose up --build

Access the Application
Once the containers are running, open your web browser and go to:
http://localhost:8000

You will see the login page and can start using the application.

Running Tests Locally
First, make sure your application is running in the background by using the command docker compose up -d.

1. Unit & Integration Tests
These tests check the backend code and its connection to the database. They run inside the Docker container.
docker compose exec app pytest

3. End-to-End (E2E) Tests
These tests use Playwright to simulate a real user in a browser. They run on your local machine.

Install local dependencies (you only need to do this once):
pip install -r requirements.txt
playwright install

Run the E2E tests:
pytest e2e_tests/
