# Engineering Principles

Version: 1.0.0

## Purpose

This document defines the engineering standards followed throughout this repository. These principles exist to maintain consistency, readability, scalability, and maintainability across the codebase.

# 1. Architecture

- Follow Clean Architecture principles.
- Follow Domain-Oriented package organization.
- Prefer composition over inheritance.
- Build loosely coupled and highly cohesive modules.
- Business logic must never depend directly on infrastructure.

# 2. Monorepo

This repository follows a Monorepo architecture.

Each module represents a deployable application or a reusable platform component.

Example:

```
platform/
services/
apps/
docs/
```

Modules must remain independently buildable.

# 3. Semantic Versioning

This project follows Semantic Versioning.

```
MAJOR.MINOR.PATCH
```

Examples

```
1.0.0
1.1.0
1.1.1
2.0.0
```

Rules

- PATCH → Bug fixes
- MINOR → Backward compatible features
- MAJOR → Breaking changes

Every module follows the same repository version.

# 4. Platform Modules

Cross-cutting concerns belong in platform modules.

Examples

- Security
- Logging
- Request Context
- REST Client
- Exception Handling

Business services must reuse platform modules instead of implementing duplicate functionality.

# 5. Microservices

Services own their domain.

Every service:

- Owns its database
- Owns its APIs
- Owns its business rules

No service accesses another service's database.

# 6. Database

- PostgreSQL
- Flyway for schema migrations
- UUID as primary keys
- No business logic inside database triggers

# 7. API Design

RESTful APIs.

Rules

- Consistent naming
- Version APIs when required
- Validation at boundaries
- Standard error responses
- OpenAPI documentation

# 8. Security

Authentication and authorization are platform responsibilities.

Business services consume authenticated user information and must not implement authentication logic.

JWT is the authentication mechanism.

Passwords are stored using BCrypt.

# 9. Logging

Every request must contain:

- Correlation ID
- Request ID (if applicable)

Structured logging only.

Sensitive information must never be logged.

# 10. Testing

Minimum expectations

- Unit Tests
- Repository Tests
- Controller Tests

Business logic should remain easily testable.

# 11. Dependencies

Services may depend on

- Platform modules
- Shared contracts

Services must never directly depend on another service's implementation.

# 12. Code Style

- Constructor Injection
- Immutable DTOs where practical
- No field injection
- Avoid static state
- Prefer interfaces for extension points

# 13. Documentation

Every architectural decision should be documented using ADRs.

Major changes require:

- ADR
- Changelog
- Version increment

# 14. Keep It Simple

Prefer simple, maintainable solutions.

Avoid introducing distributed system complexity unless there is a demonstrated need.

Good architecture values clarity over cleverness.