# ADR-006: Establish Premium Service for Premium Tracking

## Status

Accepted

## Context

Premium tracking is responsible for monitoring premium payments throughout the policy lifecycle.

The requirements define payment tracking independently from policy management.

## Problem

Payment processing evolves independently from policy administration.

Future integrations with payment providers and accounting systems justify an independent service.

## Decision

A dedicated Premium Service shall own:

- Premium Schedule
- Premium Payments
- Payment Status
- Due Dates
- Payment History
- Reminder Generation

Entities:

- PremiumPayment

## Consequences

### Advantages

- Independent billing lifecycle
- Easier payment integration
- Scalable payment processing

### Trade-offs

Requires policy validation before payment generation.

## Future Considerations

Future enhancements:

- Razorpay
- Stripe
- UPI
- Refunds
- Ledger
- Invoice Generation