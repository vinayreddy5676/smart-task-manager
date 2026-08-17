# Smart Task Manager

A full-stack task management application built with **Java, Spring Boot, React, TypeScript, MySQL, Docker, and Nginx**, with AI-assisted task prioritization and production HTTPS deployment.

## Tech Stack

* **Backend:** Java 21, Spring Boot, Spring Security, JWT, JPA/Hibernate
* **Frontend:** React, TypeScript, Vite
* **Database:** MySQL
* **AI:** Gemini API
* **DevOps:** Docker, Docker Compose, Nginx, AWS EC2
* **Security:** JWT Authentication, CORS, HTTPS/SSL
* **API:** REST APIs, Swagger/OpenAPI

## Key Features

* User registration and JWT-based authentication
* Create, update, delete and complete tasks
* Task filtering by priority and status
* Task search functionality
* AI-assisted task priority suggestions
* RESTful backend APIs
* Responsive React dashboard

## Production Deployment

The application is deployed on an **AWS EC2 Ubuntu server** using Docker containers.

```text
User
  ↓ HTTPS
Domain
  ↓
Nginx
  ├── React Frontend
  └── Spring Boot REST API
          ↓
        MySQL
```

### Production Setup

* Dockerized Spring Boot backend
* Dockerized React frontend
* MySQL running in Docker
* Docker network for frontend/backend/database communication
* Nginx configured as a reverse proxy
* Custom domain configured for the application
* HTTPS enabled using **Let's Encrypt / Certbot**
* CORS configured for the production HTTPS domain
* Containers configured with restart policies for availability

## API

The backend exposes REST endpoints for authentication and task management.

Swagger/OpenAPI is also configured for API documentation.

## Deployment

The application is currently running on an AWS EC2 Ubuntu server behind Nginx with HTTPS enabled.

**Live:** https://smart-tasks.duckdns.org
