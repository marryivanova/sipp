![Python](https://img.shields.io/badge/Language-Python-blue.svg?style=flat&logo=python)
![FastAPI](https://img.shields.io/badge/Framework-FastAPI-009688.svg?style=flat&logo=fastapi)
![Version](https://img.shields.io/badge/Version-0.1.0-informational.svg?style=flat)
![License](https://img.shields.io/badge/License-See_LICENSE-blue.svg?style=flat)

# ✨ Sipp: A Robust API Platform for Service Integration and Communication

Sipp is a modern, high-performance API platform built with FastAPI and Python, designed for seamless integration with various services and efficient communication workflows. It provides a scalable and maintainable foundation for developing feature-rich applications, supporting asynchronous operations, comprehensive logging, and flexible deployment options through Docker.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)

## Features

Sipp offers a powerful set of features to streamline development and deployment of integrated services:

-   **High-Performance API with FastAPI:** Built on FastAPI, providing blazing-fast and highly concurrent API endpoints with automatic interactive documentation (Swagger UI/OpenAPI and ReDoc).
-   **Modular and Maintainable Architecture:** A well-organized codebase with clear separation of concerns, including dedicated modules for API endpoints, authentication, and external service configurations (e.g., SMTP).
-   **Comprehensive Logging:** Integrates `loguru` for robust and structured logging, with separate log files for debug and info levels, featuring automatic rotation, retention, and compression for efficient log management.
-   **Containerized Deployment with Docker:** Production-ready deployment facilitated by `Dockerfile` and `docker-compose.yml`, including Nginx as a reverse proxy with built-in Let's Encrypt support for secure HTTPS connections.
-   **Integrated Frontend Serving:** Capable of serving static frontend assets directly, allowing for a unified deployment of both the backend API and a client-side user interface.
-   **Asynchronous Operations & Background Tasks:** Leverages `aiofiles` for non-blocking file I/O and `celery` for efficient background task processing, enhancing application responsiveness and scalability.
-   **External Service Integrations:** Includes dependencies and modules for seamless interaction with third-party services like Bitrix24 (CRM) and SendGrid (email services).

## Tech Stack

The Sipp project is built using a diverse and modern technology stack to ensure performance, scalability, and ease of development:

-   **Python**: The primary programming language used for the backend logic.
-   **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
-   **Uvicorn**: An ASGI server, essential for running FastAPI applications efficiently.
-   **Pydantic**: Provides data validation and settings management using Python type hints, ensuring robust and type-safe configurations.
-   **Pydantic-Settings**: Enhances Pydantic for application settings, allowing configuration via environment variables, `.env` files, etc.
-   **Express.js**: (Mentioned in project context) A popular Node.js web application framework, often used for building robust APIs and web applications. While the primary backend here is FastAPI, it might imply client-side interaction or a broader architectural context.
-   **Poetry**: A powerful dependency management and packaging tool for Python.
-   **Docker**: A platform for developing, shipping, and running applications in containers, enabling consistent environments.
-   **Nginx**: A high-performance web server and reverse proxy used for routing and serving requests, especially with SSL termination.
-   **python-multipart**: Used for parsing `multipart/form-data` requests, common in file uploads.
-   **Celery**: A distributed task queue system for executing asynchronous tasks and background jobs.
-   **Jinja2**: A modern and designer-friendly templating language for Python, used for dynamic HTML content.
-   **HTTPX**: A fully-featured HTTP client for Python, supporting HTTP/1.1 and HTTP/2.
-   **aiofiles**: Enables asynchronous file operations, crucial for non-blocking I/O in ASGI applications.
-   **Loguru**: A library that brings joy to Python logging with its simplicity and power.
-   **itsdangerous**: Provides tools to safely sign and serialize data, often used for token generation.
-   **PyJWT**: A Python implementation of JSON Web Tokens, used for secure authentication and authorization.
-   **bitrix24-python3-client**: A Python client for interacting with the Bitrix24 CRM API.
-   **sentry-sdk**: The official SDK for Sentry, enabling robust error tracking and performance monitoring.
-   **starlette**: The lightweight ASGI framework that FastAPI is built upon, providing essential tools for web development.
-   **python-dotenv**: Loads environment variables from `.env` files, simplifying local configuration.
-   **requests**: An elegant and simple HTTP library for Python, used for making web requests.
-   **SQLAlchemy**: A powerful SQL toolkit and Object-Relational Mapper (ORM) for database interactions.
-   **PyMySQL**: A pure-Python MySQL client library.
-   **redis**: A Python client for Redis, a powerful in-memory data store.
-   **mysql-connector-python**: The official MySQL driver for Python.
-   **tenacity**: A general-purpose retrying library, adding resilience to network requests and other operations.
-   **PyBitrix**: Another Python library for interacting with the Bitrix24 API.
-   **apscheduler**: An in-process task scheduler with optional persistent storage, useful for cron-like jobs.
-   **Babel**: Internationalization utilities for Python applications.
-   **sendgrid**: The official SendGrid API library for sending emails.
-   **watchdog**: Python API and shell utilities to monitor filesystem events.

## Installation

Follow these steps to set up Sipp locally or with Docker:

### Prerequisites

Ensure you have the following installed:

-   Python 3.9+
-   Poetry (recommended) or pip
-   Docker and Docker Compose (for containerized deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sipp.git
cd sipp

```

### 2. Environment Variables

Create a `.env` file in the root directory of the project and populate it with necessary environment variables. Refer to `settings.py` for required variables. Example:

```dotenv
APP_HOST=0.0.0.0
APP_PORT=8000
APP_DOMAIN=http://localhost:8000
NGINX_CONF_FILENAME=default # Or whatever your Nginx config is named (e.g., sippprom.hwschool.pro)

LE_EMAIL= # For Let's Encrypt in Docker Compose

LE_FQDN= # For Let's Encrypt in Docker Compose

LETSENCRYPT=true # Set to true to enable Let's Encrypt

```

### 3. Using Poetry (Recommended)

If you have Poetry installed:

```bash
poetry install
poetry shell

```

### 4. Using pip

If you prefer pip:

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`

pip install -r requirements.txt # (assuming you generate this from pyproject.toml: `poetry export -f requirements.txt --output requirements.txt --without-hashes`)

```
**Note**: If `requirements.txt` is not available, you can install dependencies manually or generate it from `pyproject.toml` using Poetry.

### 5. Docker Deployment

For a production-like setup with Nginx and HTTPS:

```bash
docker-compose build
docker-compose up -d

```

This will build and start the `server-sip` (FastAPI backend) and `nginx-sipp` (Nginx reverse proxy) services. The Nginx service is configured with `umputun/nginx-le` to automatically provision SSL certificates via Let's Encrypt using the `LE_EMAIL` and `LE_FQDN` environment variables.

## Usage

### Running Locally

After installation, you can run the FastAPI application directly:

1.  **Activate your virtual environment** (if using Poetry, `poetry shell`; if using pip, `source .venv/bin/activate`).
2.  **Run the application** using Uvicorn:

    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

    ```

    The API will be accessible at `http://localhost:8000`.

### Accessing API Documentation

Once the application is running, you can access the interactive API documentation:

-   **Swagger UI**: `http://localhost:8000/docs`
-   **ReDoc**: `http://localhost:8000/redoc`

### Running with Docker Compose

If you started the services with `docker-compose up -d`:

-   The application will be accessible via Nginx, typically on ports 80 (HTTP) and 443 (HTTPS) if Let's Encrypt is configured and working. Check your `LE_FQDN` setting for the domain.
-   The FastAPI server itself will be running internally on port `8000` within its container.

## Project Structure

```
├── Dockerfile
├── README.md
├── aireadme_output/
│   └── project_structure.txt
├── docker-compose.yml
├── front/
│   └── public/
│       ├── func.js
│       ├── index.html
│       ├── logo.jpg
│       ├── style.css
│       └── клей.png
├── logs/
│   ├── debug/
│   │   └── logs.log
│   └── info/
│       └── logs.log
├── main.py
├── nginx/
│   └── Dockerfile
├── poetry.lock
├── pydoc-markdown.yaml
├── pyproject.toml
├── secret_key.json
├── settings.py
└── src/
    ├── __init__.py
    ├── api/
    │   ├── __init__.py
    │   └── endpoints/
    └── smtp_conf/
        ├── __init__.py
        └── smtp_gmail.py

```

-   **`front/`**: Contains static files for the frontend, served by the FastAPI application.
-   **`src/`**: Houses the core application logic, including API endpoints and specific configurations.
    -   **`src/api/endpoints/`**: Directory for defining various API routes and their handlers.
    -   **`src/smtp_conf/`**: Contains modules related to SMTP (email) configurations, such as `smtp_gmail.py`.
-   **`main.py`**: The main entry point of the FastAPI application, where the app instance is created, logging is set up, static files are mounted, and API routers are included.
-   **`settings.py`**: Centralized configuration management using Pydantic, defining application settings and environment variable mappings.
-   **`docker-compose.yml`**: Defines the multi-service Docker environment, orchestrating the FastAPI backend and Nginx reverse proxy.
-   **`nginx/`**: Contains Nginx specific configurations and potentially SSL certificate volumes.
-   **`pyproject.toml`** and **`poetry.lock`**: Poetry's files for managing project dependencies and virtual environments.
-   **`secret_key.json`**: Stores the application's secret key, used for security purposes like token signing.
-   **`logs/`**: Directory dedicated to storing application logs, separated by debug and info levels.
-   **`pydoc-markdown.yaml`**: Configuration file for generating documentation from Python docstrings.

## Configuration

Sipp's configuration is flexible and can be managed through several mechanisms:

-   **`.env` File**: Environment variables are loaded from the `.env` file in the project root. This is the primary way to configure settings like `APP_HOST`, `APP_PORT`, `APP_DOMAIN`, and Nginx-specific variables (`NGINX_CONF_FILENAME`, `LE_EMAIL`, `LE_FQDN`, `LETSENCRYPT`).
-   **`settings.py`**: Defines application settings using Pydantic, allowing for type-hinted and validated configurations. These settings can pull values from environment variables or provide defaults.
-   **`secret_key.json`**: Contains a JSON object holding the `secret_key` used for cryptographic operations within the application (e.g., JWT signing).
-   **`nginx/`**: Nginx configuration files (e.g., `nginx/${NGINX_CONF_FILENAME}.conf`) and SSL certificate volumes (`./nginx/ssl`) are used to configure the reverse proxy and HTTPS.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests with improvements, bug fixes, or new features.

## License

This project is licensed under an open-source license. Please see the `LICENSE` file for full details.

## Authors

-   Ola Amigo (olyabjj@gmail.com)
