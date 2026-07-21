# ADR-004: Logging and Request Context Infrastructure

## Status

Accepted

## Context

The application requires a consistent mechanism for request tracing, correlation, and operational logging across all incoming HTTP requests.

An earlier design separated request context management and logging into two independent modules. During implementation, it became evident that the request context functionality existed solely to support the logging infrastructure and did not provide sufficient standalone value.

Maintaining two modules introduced unnecessary dependency management and increased project complexity.

## Decision

Request context management has been merged into the Logging module.

The Logging module is now responsible for:

- Correlation ID generation
- Correlation ID propagation
- RequestContext lifecycle management
- MDC (Mapped Diagnostic Context) population
- Request logging
- Exception logging
- HTTP request tracing

The RequestContext is initialized at the beginning of every request and cleared once request processing completes.

## Consequences

### Positive

- Reduced module count
- Simpler dependency graph
- Easier integration into Spring Boot applications
- Centralized request tracing infrastructure
- Less configuration required by consuming services

### Negative

- Logging module has broader responsibility
- RequestContext cannot be reused independently without the logging infrastructure

## Alternatives Considered

### Separate Request Context Module

Pros

- Clear separation of responsibilities
- Independent evolution

Cons

- Additional module maintenance
- Extra dependency for every service
- Limited standalone usefulness

This option was rejected due to the low complexity of the request context functionality and its tight coupling with logging.