# ADR-002: Shared Package Policy

## Status

Accepted

## Context

FlashTix will contain multiple independently developed and deployed services.

Sharing code between services can reduce duplication, but sharing service-specific domain models or business logic can tightly couple services and make independent changes harder.

We need rules defining what belongs in shared packages.

## Decision

Shared packages may contain small, stable, cross-service technical primitives.

Examples allowed:

- Correlation ID helpers
- Generic event envelope types
- Common technical API error response shapes
- Other carefully versioned technical contracts

Shared packages must not contain service-specific domain models or business rules.

Examples not allowed:

- Auth Service User database model
- Inventory seat state-transition rules
- Order calculation/business rules
- Payment business logic

Each service owns its own domain models and business behavior.

Shared packages must be explicitly versioned. Breaking changes require a major version change.

## Why

This gives FlashTix consistency for genuinely common technical concerns while avoiding tight coupling between service business domains.

A service should be able to evolve its internal models without forcing unrelated services to change.

## Trade-offs

Some code or types may be duplicated between services.

We accept small duplication when it helps preserve service independence and clear ownership.

Shared packages themselves still create dependencies, so they should remain small and stable.

## Consequences

- Services remain responsible for their own domain logic.
- Cross-service technical conventions can remain consistent.
- Shared package changes must consider backward compatibility.
- Services should not require synchronized deployment because of internal domain-model changes.