# Insurance Management System (IMS)

> A cloud-native microservices-based Insurance Management System built with Spring Boot, Spring Cloud, React, and modern enterprise architecture principles.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.16-brightgreen)
![Spring Cloud](https://img.shields.io/badge/Spring_Cloud-Latest-blue)
![Architecture](https://img.shields.io/badge/Architecture-Microservices-purple)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
---

## Overview

The Insurance Management System (IMS) is an enterprise application designed to streamline and automate core insurance operations. The project demonstrates modern enterprise software engineering practices through a scalable, secure, and maintainable microservices architecture built using the Spring ecosystem and a React-based frontend.

The system manages the complete insurance lifecycle, including customer management, policy administration, claims processing, premium tracking, document management, and reporting.

This project was developed to showcase modern software engineering practices including:

- Domain-driven service decomposition
- Microservices architecture
- JWT-based authentication and authorization
- Centralized configuration management
- Service discovery
- API Gateway routing
- Centralized logging
- Inter-service communication
- RESTful API design
- Architecture Decision Records (ADRs)


# Features

### Backend

- JWT Authentication & Authorization
- Customer Management
- Policy Management
- Claims Management
- Premium Management
- Document Management
- RESTful APIs
- Centralized Logging
- Shared Security Framework
- Config Server

### Frontend

- Responsive React UI
- Secure Authentication
- Protected Routes
- Reusable Components
- Client-side Routing
- REST API Integration


# Architecture

The application follows a microservices architecture where each business capability is implemented as an independently deployable service.


```
                          +--------------------------------+
                          |           Clients              |
                          | Web • Mobile • Third-Party API |
                          +---------------+----------------+
                                          |
                                          |
                                  +-------v--------+
                                  |   API Gateway  |
                                  +-------+--------+
                                          |
                +-------------------------+-------------------------+
                |                                                   |
        +-------v--------+                                 +--------v--------+
        | Config Server  |                                 | Service Registry|
        +----------------+                                 +-----------------+

────────────────────────────────────────────────────────────────────────────────

                         Shared Libraries (Reusable)

       +--------------------------------------------------------------+
       |            Logging | Security | Web | RestClient             |
       +--------------------------------------------------------------+

────────────────────────────────────────────────────────────────────────────────

                  Insurance Management System (Business Application)

          +------------+   +------------+   +------------+
          | Identity   |   | Customer   |   | Policy     |
          +------------+   +------------+   +------------+
                 |                 |                 |
                 +-----------------+-----------------+
                                   |
        +------------+   +------------+   +------------+   +------------+
        | Claims     |   | Premium    |   | Document   |   | Reporting  |
        +------------+   +------------+   +------------+   +------------+
```

# Technology Stack

| Layer          | Technology                                       |
| -------------- | ------------------------------------------------ |
| Backend        | Java, Spring Boot, Spring Security, Spring Cloud |
| Frontend       | React 19, TypeScript, Vite                       |
| UI             | Tailwind CSS 4, Headless UI, Heroicons           |
| Database       | PostgreSQL                                       |
| Authentication | JWT                                              |
| Communication  | REST APIs, Spring RestClient, Axios              |
| Build          | Maven, npm, Vite                                 |



---

# Project Structure

The project is organized as a multi-module Maven monorepo with a clear separation between platform libraries, business services, and infrastructure components.

```
Insurance Management System
│
├── IMS Platform
│   ├── Web Module
│   ├── Logging Module
│   ├── Security Module
│   └── RestClient Module
│
├── IMS Services
│   ├── Identity Service
│   └── Policies Service
│
├── IMS Cloud Management
│  ├── Config Server
│  ├── API Gateway
│  └── Service Registry
│
└── UI (React + TypeScript + Vite)

```

### Maven Reactor

```
Insurance Management System
├── IMS Platform
│   ├── Web Module
│   ├── Logging Module
│   ├── Security Module
│   └── RestClient Module
│
├── IMS Services
│   ├── Identity Service
│   └── Policies Service
│
└── IMS Cloud Management
    ├── Config Server
    ├── API Gateway
    └── Service Registry

```

Each module is independently buildable while sharing common dependency management through the parent Maven project.

```
Insurance Management System (Parent)
│
├── Dependency Management
├── Plugin Management
├── Common Build Configuration
└── Child Modules
```

# Architectural Decisions

The project documents major architectural decisions using Architecture Decision Records (ADRs).

| ADR | Description |
|------|-------------|
| ADR-000 | Adopt Microservices Architecture |
| ADR-001 | Identity Service |
| ADR-002 | JWT Authentication Strategy |
| ADR-003 | Customer Service |
| ADR-004 | Policy Service |
| ADR-005 | Claims Service |
| ADR-006 | Premium Service |
| ADR-007 | Document Service |
| ADR-008 | Reporting Service |

# Design Principles

The system is built around the following architectural principles:

- Microservices Architecture
- Single Responsibility Principle
- Separation of Concerns
- Database per Service
- Loose Coupling
- High Cohesion
- Independent Deployment
- Stateless Authentication
- Centralized Configuration
- Reusable Shared Libraries


# Running the Project

## Prerequisites

- Java 21+ (or your project version)
- Maven
- PostgreSQL
- Docker (optional)

## Startup Order

1. Config Server
2. Service Registry
3. API Gateway
4. Identity Service
5. Remaining Business Services

# Future Enhancements

- Event-Driven Communication
- Distributed Tracing
- Centralized Monitoring
- Containerization with Docker
- Kubernetes Deployment
- CI/CD Pipeline
- Notification Service
- Payment Gateway Integration

# License

This project is developed for educational and learning purposes.

# Author

Developed as part of an internship project to demonstrate enterprise application development using Spring Boot, Spring Cloud, React, and microservices architecture. 

**Venkata Kiran J** - [Connect with me on LinkedIn](https://www.linkedin.com/in/venkata-kiran-jakkapu-a2209415a/)

