# ADR-004: Establish Policy Service for Insurance Product Management

## Status

Accepted

## Context

Policies are the core insurance products offered by the company.

Policies define:

- Coverage
- Premium Amount
- Validity
- Policy Type
- Policy Status

Policies exist independently of customers and subscriptions.

## Problem

Insurance products require independent lifecycle management.

Business operations such as creating, modifying, renewing, or retiring policies should not affect claims or premium processing.

## Decision

A dedicated Policy Service shall own:

- Policy Creation
- Policy Updates
- Policy Catalog
- Policy Status
- Policy Renewal
- Policy Cancellation
- Policy Expiry

Entities:

- Policy
- PolicyType

Other services reference Policy by policyId.

## Consequences

### Advantages

- Independent insurance product lifecycle
- Clear ownership
- Supports future product expansion

### Trade-offs

Subscriptions reference policies remotely.

## Future Considerations

Future enhancements:

- Policy Versioning
- Coverage Rules
- Riders
- Discounts
- Product Catalog