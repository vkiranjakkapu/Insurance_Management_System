# ADR-003: Establish Customer Service for Customer Lifecycle Management

## Status

Accepted

## Context

Customer Management is a dedicated functional module responsible for maintaining customer information throughout the insurance lifecycle.

Customers interact with policies, premium payments, claims, and documents but customer information itself represents an independent business domain.

## Problem

Customer information evolves independently from insurance products.

Mixing customer data with policy data tightly couples unrelated business concerns.

## Decision

A dedicated Customer Service shall own:

- Customer Registration
- Customer Profile
- Customer Search
- Customer History
- Customer Contact Information
- Customer Address
- Customer KYC (future)
- Customer Nominees (future)

Entities owned:

- Customer
- Address (future)
- Nominee (future)

Other services reference Customer by customerId.

## Consequences

### Advantages

- Independent customer lifecycle
- Clear ownership
- Easier customer onboarding
- Reusable customer information

### Trade-offs

Business services must communicate using customer identifiers.

## Future Considerations

Future enhancements:

- CRM Integration
- Customer Verification
- Risk Profiling
- Customer Preferences