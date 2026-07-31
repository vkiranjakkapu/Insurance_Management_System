# ADR-005: Establish Claims Service for Claim Processing

## Status

Accepted

## Context

Claim processing follows an independent workflow involving submission, verification, approval, rejection, and claim history.

Claims represent one of the primary business capabilities of the insurance platform.

## Problem

Claim processing has a significantly different lifecycle than policy management.

It involves approvals, document verification, investigations, and settlement processes.

## Decision

A dedicated Claims Service shall own:

- Claim Submission
- Claim Review
- Claim Verification
- Claim Approval
- Claim Rejection
- Claim History

Entities:

- Claim
- ClaimStatus

Claims reference:

- Policy
- Customer

## Consequences

### Advantages

- Independent claim workflow
- Easier workflow automation
- Supports future settlement processes

### Trade-offs

Requires policy validation before claim creation.

## Future Considerations

Future enhancements:

- Surveyor Assignment
- Fraud Detection
- Settlement
- Appeals
- Investigation Workflow