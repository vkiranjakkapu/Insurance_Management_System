# ADR-002: JWT Authentication Strategy

## Status

Accepted

## Context

The system requires stateless authentication suitable for REST APIs while supporting secure session renewal.

## Decision

Authentication is implemented using JSON Web Tokens (JWT).

The system issues:

- Access Token
- Refresh Token

Refresh tokens are persisted in the database and can be revoked during logout.

Authorization is implemented using Spring Security Role-Based Access Control (RBAC).

Passwords are encrypted using BCrypt.

## Consequences

### Positive

- Stateless authentication
- Scalable architecture
- Secure logout
- Token expiration support

### Negative

- Token management complexity
- Refresh token persistence required