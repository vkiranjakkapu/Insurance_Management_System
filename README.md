# Architecture

## Overview

The Insurance Management Platform is built using a **Microservices Architecture** supported by a set of reusable **Platform Engineering modules**. Each business capability is implemented as an independent Spring Boot microservice, while common infrastructure such as security, logging, request context propagation, exception handling, and REST client configuration is shared across all services through reusable platform libraries.

The platform follows the principle of **"Build Once, Reuse Everywhere"**, ensuring consistency across services while minimizing duplicated infrastructure code.

# High-Level Architecture

```text
                                         React + Vite
                                              │
                                   HTTPS + JWT Access Token
                                              │
                                              ▼
                           ┌──────────────────────────────────┐
                           │          API Gateway             │
                           │──────────────────────────────────│
                           │ • Request Routing                │
                           │ • JWT Authentication             │
                           │ • Authorization                  │
                           │ • Request Context Initialization │
                           │ • Correlation ID Generation      │
                           │ • Request Logging                │
                           └───────────────┬──────────────────┘
                                           │
          ─────────────────────────────────┼─────────────────────────────────
                                           │
      ┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
      │  Identity   │  Customer   │   Policy    │   Premium   │   Claims    │
      │   Service   │   Service   │   Service   │   Service   │   Service   │
      └─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
                                           │
                                  ┌────────┴─────────┐
                                  │ Document Service │
                                  └────────┬─────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │ Reporting       │
                                  │ Service         │
                                  └─────────────────┘
                                           │
                                  Aggregates business
                                  data from all services
```

# Platform Modules

Every microservice depends on a common set of platform libraries that provide standardized infrastructure capabilities.

```text
platform

├── security
│   ├── JWT Authentication
│   ├── Authorization
│   ├── Authentication Context
│   └── Security Auto Configuration
│
├── logging
│   ├── Request Logging
│   ├── Exception Logging
│   ├── MDC Support
│   ├── Correlation ID
│   ├── User Context
│   └── Request Metadata
│
├── rest-client
│   ├── WebClient Configuration
│   ├── Header Propagation
│   └── Authentication Propagation
│
├── web
│   ├── Exception Translation
│   └── Common Web Configuration
│
└── platform-bom
```

Each service imports these shared platform modules instead of implementing infrastructure concerns independently.

# Microservices

## API Gateway

The API Gateway acts as the single entry point for all client requests.

Responsibilities:

- Request routing
- JWT authentication
- Authorization
- Correlation ID generation
- Request context initialization
- Request logging
- Forward authenticated requests to downstream services

No business logic is implemented within the gateway.

## Identity Service

Responsible for user identity and authentication.

Responsibilities:

- User Registration
- User Login
- Password Encryption
- JWT Generation
- Refresh Token Management
- User Account Management

The Identity Service **issues JWT tokens**, while token validation is handled by the API Gateway.

## Customer Service

Responsible for customer lifecycle management.

Responsibilities:

- Customer Registration
- Customer Profile
- Customer Search
- Customer Updates

Owns the Customer database tables.

## Policy Service

Responsible for insurance policy management.

Responsibilities:

- Policy Creation
- Policy Renewal
- Policy Cancellation
- Policy Status Management

## Premium Service

Responsible for premium payment management.

Responsibilities:

- Premium Payments
- Payment History
- Due Date Tracking
- Payment Status

## Claims Service

Responsible for claim processing.

Responsibilities:

- Claim Submission
- Claim Verification
- Claim Approval
- Claim Rejection
- Claim History

## Document Service

Responsible for document management.

Responsibilities:

- Document Upload
- Document Download
- Metadata Management
- File Storage

## Reporting Service

Responsible for business analytics and dashboard generation.

Instead of the frontend directly invoking multiple services, the Reporting Service aggregates data from downstream services and exposes dashboard-ready APIs.

Responsibilities:

- Active Policies
- Expired Policies
- Premium Collection
- Claim Statistics
- Customer Growth
- Dashboard Aggregation

# Authentication Flow

```text
User Login
     │
     ▼
Identity Service
     │
Generate JWT
     │
     ▼
Client Stores JWT
     │
     ▼
Client Request
     │
     ▼
API Gateway
     │
Validate JWT
     │
Create Authentication Context
     │
Forward Authenticated Request
     │
     ▼
Business Service
     │
Execute Business Logic
     │
     ▼
Response
```

Authentication is performed once at the API Gateway before requests are routed to downstream services.

# Dashboard Flow

```text
Dashboard UI
      │
      ▼
GET /reports/dashboard
      │
      ▼
Reporting Service
      │
      ├────────► Customer Service
      │
      ├────────► Policy Service
      │
      ├────────► Premium Service
      │
      ├────────► Claims Service
      │
      └────────► Document Service
                   │
                   ▼
          Aggregate Business Data
                   │
                   ▼
          Dashboard Response DTO
                   │
                   ▼
              React Dashboard
```

The frontend communicates with a single Reporting API, while the Reporting Service orchestrates data retrieval from the required business services.

# Project Structure

```text
insurance-management-platform

├── platform
│   ├── security
│   ├── logging
│   ├── request-context
│   ├── rest-client
│   ├── web
│   ├── common
│   └── platform-bom
│
├── gateway-service
│
├── identity-service
│
├── customer-service
│
├── policy-service
│
├── premium-service
│
├── claims-service
│
├── document-service
│
├── reporting-service
│
└── frontend
```

# Architectural Principles

- Microservices Architecture
- API Gateway Pattern
- Platform Engineering with Shared Libraries
- Feature-Oriented Services
- Single Responsibility Principle
- Stateless REST APIs
- JWT-Based Authentication
- Shared Cross-Cutting Infrastructure
- Independent Service Deployment
- Database Ownership per Service (logical separation)

# Future Enhancements

The architecture has been designed to support future enhancements with minimal changes, including:

- Service Discovery
- Distributed Configuration
- Docker & Kubernetes
- Distributed Tracing
- Message Queues (Kafka/RabbitMQ)
- API Rate Limiting
- Observability & Monitoring
- CI/CD Pipelines
- Cloud Deployment