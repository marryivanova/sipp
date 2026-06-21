![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-005571?logo=fastapi)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

# Sipp 2: Adhesive Solutions & Customer Engagement 🚀

Sipp 2 is a modern web application designed for a wholesale company specializing in adhesive products. It features a custom micro-frontend for a dynamic user experience and a robust FastAPI backend that handles feedback submissions, dispatching email notifications to the company. The project emphasizes lightweight architecture and efficient customer interaction.

## Table of Contents

-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [Contributing](#contributing)
-   [License](#license)
-   [Author](#author)

## Features

*   **Dynamic Micro-Frontend Website**: A custom-built, responsive user interface using HTML, CSS, and JavaScript, tailored for presenting adhesive products and engaging potential clients.
*   **FastAPI Backend**: A lightweight and high-performance Python API built with FastAPI, serving both static frontend assets and handling backend logic.
*   **Feedback Form & Email Notifications**: Users can submit feedback or inquiries through the website's form, triggering an automated email notification to the company's designated inbox.
*   **Containerized Deployment**: Ready for deployment with Docker and Docker Compose, including Nginx for efficient serving and SSL termination (with Let's Encrypt integration).
*   **Robust Logging**: Integrated `loguru` for comprehensive and structured logging of application activities, aiding in monitoring and debugging.
*   **Authentication Endpoints**: Basic authentication support using JWT for secure API access and management (e.g., for future admin panels or internal tools).

## Tech Stack

The Sipp 2 project leverages a diverse set of technologies to deliver a fast, scalable, and maintainable web application:

*   **Python**: The primary backend programming language.
    *   **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
    *   **Pydantic**: Data validation and settings management using Python type hints, crucial for API request/response models and configuration.
    *   **Pydantic-Settings**: Manages application settings, allowing for flexible configuration via environment variables, `.env` files, and more.
    *   **Python-Multipart**: Required for handling form data, especially file uploads in FastAPI.
    *   **Celery**: An asynchronous task queue/job queue, potentially used for background tasks like sending emails without blocking the main request thread.
    *   **Jinja2**: A modern and designer-friendly templating language for Python, used here to render HTML email templates.
    *   **HTTPX**: A robust HTTP client for Python, used for making asynchronous HTTP requests.
    *   **AIOFiles**: Enables asynchronous file operations, which is beneficial for non-blocking I/O.
    *   **Loguru**: A simple yet powerful logging library for Python, providing flexible and structured logging.
    *   **ItsDangerous**: Safely sign data, useful for handling tokens, cookies, or other sensitive information.
    *   **PyJWT**: Python implementation of JSON Web Token, used for handling authentication tokens.
    *   **Uvicorn**: An ASGI web server, used to serve the FastAPI application.
    *   **FastAPI-Mail**: A library for sending emails easily with FastAPI, used for feedback notifications.
*   **CSS**: Used for styling the frontend, creating a visually appealing and responsive design.
*   **HTML**: The standard markup language for creating web pages, forming the structure of the micro-frontend.
*   **JavaScript**: Adds interactivity and dynamic behavior to the frontend, including the feedback form logic.
*   **Docker**: Containerization platform to package the application and its dependencies into isolated containers.
*   **Docker Compose**: A tool for defining and running multi-container Docker applications, orchestrating the FastAPI server and Nginx.
*   **Nginx**: A high-performance web server, reverse proxy, and load balancer, used here to serve the frontend and proxy requests to the FastAPI backend.
*   **Poetry/Pip**: Python dependency management tools. Poetry is used in `pyproject.toml`, which internally manages dependencies that can be installed via pip.

## Installation

Follow these steps to set up and run the Sipp 2 project locally or with Docker.

### Prerequisites

*   Python 3.9+
*   Poetry (recommended) or pip
*   Docker and Docker Compose (for containerized deployment)

### 1. Clone the Repository

```bash
git clone <repository_url>
cd Sipp-2

```
*(Replace `<repository_url>` with the actual URL of your project repository.)*

### 2. Python Environment Setup (Local)

If you prefer to run the backend directly on your machine:

1.  **Create a Virtual Environment:**
    ```bash
    python -m venv .venv
    source .venv/bin/activate # On Windows: .venv\Scripts\activate

    ```

2.  **Install Dependencies using Poetry:**
    ```bash
    pip install poetry
    poetry install

    ```
    *Alternatively, if using pip:*
    ```bash
    pip install -r requirements.txt # (You might need to generate this from poetry lock file: poetry export -f requirements.txt --output requirements.txt --without-hashes)

    ```

### 3. Environment Variables

Create a `.env` file in the root directory of the project, next to `docker-compose.yml` and `pyproject.toml`. This file will store sensitive information and configuration settings.

```dotenv
# .env example
# SMTP Settings (for sending feedback emails)

SMTP_EMAIL="your_sender_email@example.com"
SMTP_PASSWORD="your_email_app_password" # Use an app password if using Gmail/Outlook

SMTP_SERVER="smtp.example.com" # e.g., smtp.gmail.com

SMTP_PORT=587 # e.g., 587 for TLS, 465 for SSL

# Application Settings (optional, can be overridden by docker-compose)

APP_PORT=8000
APP_HOST="0.0.0.0"
APP_DOMAIN="http://localhost"

# Nginx Configuration

NGINX_CONF_FILENAME="default" # Or the name of your specific Nginx config file without .conf extension

```
**Note:** For the Nginx/LetsEncrypt setup in `docker-compose.yml`, you might also need to configure `LE_EMAIL` and `LE_FQDN` directly in the `docker-compose.yml` or ensure they are provided in the environment where Docker Compose runs.

### 4. Dockerized Deployment (Recommended)

For a production-ready setup using Docker:

1.  **Build and Run Services:**
    ```bash
    docker-compose up --build -d

    ```
    This command will build the `server-sip` (FastAPI backend) and `nginx-sipp` containers, then start them in detached mode.

2.  **Verify Services:**
    ```bash
    docker-compose ps

    ```
    You should see both `server` and `nginx-sipp` containers running.

## Configuration

Configuration for Sipp 2 is primarily managed through `settings.py` and environment variables defined in the `.env` file.

*   `settings.py`: Uses `pydantic-settings` to load application settings from environment variables.
    *   `AppSettings`: General application settings (debug mode, host, port, environment).
    *   `ConfigForUvicornRun`: Specific settings for `uvicorn` server (port, host, domain).
    *   `SmtpSettings`: Critical for email functionality, sourcing `SMTP_EMAIL`, `SMTP_PASSWORD`, `SMTP_SERVER`, and `SMTP_PORT` from environment variables.

Ensure your `.env` file (or system environment variables) correctly defines these variables for the application to function as expected, especially the SMTP settings for feedback emails.

## Usage

### Accessing the Website

Once the Docker containers are running (or the local server is started), you can access the website:

*   **With Docker Compose**: If Nginx is serving on ports 80/443, navigate to `http://localhost` (or the `LE_FQDN` if configured with a domain).
*   **Locally (Backend only, Nginx not running)**: The FastAPI application will typically be available at `http://127.0.0.1:8000` or `http://localhost:8000`. The frontend files (`front/public/`) will be served statically from this endpoint.

### Running the Backend Locally

To start the FastAPI backend locally:

```bash
source .venv/bin/activate # Activate virtual environment if not already active

poetry run uvicorn main:app --host 0.0.0.0 --port 8000 --reload

```
This will start the FastAPI server on `http://localhost:8000`.

### API Endpoints

The FastAPI application exposes the following key endpoints:

*   **GET `/docs`**: Swagger UI for interactive API documentation.
*   **GET `/redoc`**: ReDoc documentation for the API.
*   **POST `/v1/api/send-email`**: Sends a feedback email to the company.
    *   **Request Body**:
        ```json
        {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone_number": "+1234567890",
          "info": "I am interested in your adhesive products."
        }

        ```
*   **Authentication Endpoints**: Check `/v1/api/auth` (and related endpoints like `/v1/api/token`) in the API documentation for authentication workflows.

## Project Structure

```
├── Dockerfile                  # Dockerfile for the FastAPI application

├── README.md                   # This README file

├── docker-compose.yml          # Defines and runs multi-container Docker applications

├── front/                      # Frontend micro-frontend assets

│   └── public/                 # Static public assets (HTML, CSS, JS, images)

│       ├── func.js             # JavaScript for frontend interactivity (e.g., burger menu, feedback form logic)

│       ├── index.html          # Main HTML entry point of the website

│       ├── logo.jpg            # Company logo

│       ├── style.css           # Global CSS styles for the website

│       └── клей.png            # Image asset (likely related to adhesive products)

├── main.py                     # Main FastAPI application entry point, mounts API and static files

├── nginx/                      # Nginx configuration and assets for Docker

│   └── Dockerfile              # Dockerfile for custom Nginx image (if any)

├── pyproject.toml              # Project metadata and Poetry dependency configuration

├── settings.py                 # Pydantic-based application settings management

└── src/                        # Source code for the FastAPI backend

    ├── __init__.py             # Python package initializer

    ├── api/                    # API related modules

    │   ├── __init__.py         # API package initializer, defines `api_router`

    │   └── endpoints/          # Specific API endpoint definitions

    │       ├── __init__.py     # Endpoints package initializer

    │       ├── auth.py         # Authentication related endpoints (login, token generation, verification)

    │       ├── sender_kp.py    # Endpoint for sending feedback emails

    │       ├── helper/         # Helper utilities for endpoints

    │       │   └── generator_secret_key/ # Module for generating and managing a secret key

    │       │       └── create_secret_key.py # Logic for generating a secure secret key

    │       └── template/       # Email templating for notifications

    │           ├── template_data.py    # Logic for rendering Jinja2 email templates

    │           └── template_email.html # HTML template for feedback emails

    └── smtp_conf/              # SMTP configuration for email sending

        ├── __init__.py         # SMTP configuration package initializer

        └── smtp_gmail.py       # Configuration for sending emails via FastAPI-Mail

```

## Contributing

Contributions are welcome! If you have suggestions for improvements, bug fixes, or new features, please open an issue or submit a pull request.

## License

All rights reserved.

## Author

Ola Amigo (olyabjj@gmail.com)
```
