# ADR-001: Adopt Microservice Architecture

## Status

Accepted

## Context

The Insurance Management System is expected to grow into multiple independent business domains including Identity, Customer, Policy, Claims, Notification, and Billing.

A modular architecture is required to improve scalability, maintainability, and independent deployment.

## Decision

The application is designed as a collection of independently deployable microservices.

The Identity Service is responsible solely for:

- Authentication
- Authorization
- User Management
- Role Management

## Consequences

### Positive

- Independent deployments
- Clear separation of concerns
- Easier maintenance
- Better scalability
- Independent database ownership

### Negative

- Increased operational complexity
- Inter-service communication
- Distributed deployments