# ADR-001: Establish Identity Service for Authentication and Authorization

## Status

Accepted

## Context

The Insurance Management Platform requires secure authentication, role-based authorization, and user management. The platform supports multiple user roles including Administrators, Insurance Agents, and Customers, each having different permissions within the system.

The requirements explicitly recommend Spring Security with JWT authentication and role-based authorization as the security mechanism.

## Problem

Authentication and authorization are platform-wide concerns that are required by every business module.

If security logic is duplicated across services, it leads to:

- Inconsistent authentication
- Duplicate user management
- Difficult permission administration
- Increased security risks

## Decision

A dedicated Identity Service shall be responsible for:

- User registration
- Authentication
- JWT generation
- JWT validation
- Role management
- User lifecycle management
- Password management
- Token refresh
- User permissions

The Identity Service owns the following entities:

- User
- Role
- Permission (future)
- Refresh Token (future)

Business services shall trust JWT tokens issued by the Identity Service.

## Consequences

### Advantages

- Single source of truth for identities
- Centralized security policies
- Simplified authorization
- Easier auditing
- Independent security evolution

### Trade-offs

- Every request depends on JWT issued by Identity.
- Business services maintain no authentication state.

## Future Considerations

Future enhancements may include:

- OAuth2
- Social Login
- Multi-Factor Authentication
- Single Sign-On (SSO)
- API Keys