# ADR-001 Identity-Service

# Identity Service

Status

Accepted

## Context

The platform requires centralized authentication and user management.

Rather than embedding authentication logic into each business service, a dedicated Identity Service will provide authentication and user administration while reusable platform modules provide the security infrastructure.

The current project requires authentication for an Insurance Management Platform while maintaining a clean architecture suitable for future extension.

## Decision

A dedicated Identity Service will be implemented.

Responsibilities include:

- Authentication
- User Management
- Role Management
- Password Management
- JWT Issuance
- Refresh Token Management

Platform modules remain responsible for:

- JWT Validation
- Security Configuration
- Authentication Context
- Authorization Support
- Request Context Integration

Business services consume authenticated user information and do not manage authentication directly.

## Scope

Version 1 includes:

Authentication

- Login
- Logout
- Refresh Token

Users

- Create
- Read
- Update
- Enable / Disable

Roles

- Assign Roles
- Manage Roles

Passwords

- Change Password
- Administrative Reset Password

## Out of Scope

The following features are intentionally excluded from Version 1:

- OAuth2
- Social Login
- MFA
- Email Verification
- Forgot Password
- OTP
- SSO
- Multi-tenancy
- API Keys
- Fine-grained Permissions
- Audit Dashboard

These features may be introduced later without changing the architectural boundary of the Identity Service.

## Database

The service owns the following tables:

- users
- credentials
- roles
- user_roles
- refresh_tokens

No other service accesses these tables directly.

## Consequences

Advantages

- Centralized authentication
- Reusable platform security
- Clear service boundaries
- Independent deployment
- Easy future enhancements

Trade-offs

- Additional service to deploy
- Internal service communication for identity operations

The separation provides long-term maintainability while keeping Version 1 implementation small and focused.