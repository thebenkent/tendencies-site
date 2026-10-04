@AGENTS.md
@../tendos-platform/CLAUDE.md

## This Repository

`tendencies-site` is **the Storefront** — the customer-facing application for Tendencies. It is where customers discover the business, browse the catalogue, start a project, and track their own work through the client portal. Per `tendos-platform/architecture/TARGET_PLATFORM.md`, it is specialised in audience and experience, not in the underlying business truth: its products, customers, orders, and campaigns are meant to draw from the same Business Domain as TendOS, not a parallel one.

## tendos-platform Is Authoritative

This repository contains implementation only. The authoritative source for the following lives in the separate `tendos-platform` repository, checked out as a sibling directory (`../tendos-platform`):

- **Architecture** — `tendos-platform/architecture/`
- **Standards** — `tendos-platform/standards/`
- **ADRs** — `tendos-platform/standards/adr/`
- **Knowledge** — `tendos-platform/knowledge/`

The imports above pull in the Next.js version warnings (`AGENTS.md`) and the full ecosystem operating manual (`tendos-platform/CLAUDE.md`) automatically. Before making any architectural decision in this repository — how a product, customer, order, or campaign is modeled, or how this application shares data with TendOS — consult the relevant `tendos-platform` documents first, not just this file.

## Keeping tendos-platform Current

If a change here alters the current state of the ecosystem, introduces a new shared pattern, or touches one of the entities named in `tendos-platform/architecture/DOMAIN_MODEL.md` (Organisation, Product, Order, Campaign, and so on), the corresponding document in `tendos-platform` must be updated as part of the same piece of work — not as a follow-up. A change that isn't reflected in `tendos-platform` didn't really happen, as far as the next session, in any repository, is concerned.
