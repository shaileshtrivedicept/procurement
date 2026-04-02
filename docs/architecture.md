# Architecture Summary - ERP Procurement Module

## Modules
1. **Auth Module**: Handles JWT-based login and Role-Based Access Control (RBAC).
2. **Vendor Module**: Manages vendor lifecycle with custom numbering (`VND-XXXXX`).
3. **Purchase Requisition (PR) Module**: Supports multi-line item entry and automated PR numbering (`PR-YYYY-XXXXX`).
4. **Approvals Module**: Core rules engine to calculate approval steps based on value slabs.
5. **Audit Module**: Captures immutable logs for all state changes in core entities.
6. **Rule Engine Module**: Data-driven routing for value-based and department-based approvals.

## Phase 1 Implementation Details
- **Frontend**: Professionally styled with Next.js and Tailwind CSS.
- **Backend**: NestJS for modular API design and service isolation.
- **Database**: PostgreSQL with Prisma for type-safe database access and migrations.
- **Approval Logic**:
  - ₹0 – ₹50,000 → Dept Head
  - ₹50,001 – ₹5,00,000 → Dept Head, Procurement Manager
  - ₹5,00,001 – ₹25,00,000 → Dept Head, Procurement Manager, Finance Head
  - ₹25,00,001+ → Dept Head, Procurement Manager, Finance Head + MD

## Stubs for Future Phases
The following services are scaffolded but require full implementation in later phases:
- `rfq.service.ts`: RFQ from Approved PR logic.
- `grn.service.ts`: Goods Receipt Note and Item Receipt logic.
- `invoices.service.ts`: 3-Way Match logic (PO vs GRN vs Invoice).
- `contracts.service.ts`: Contract Lifecycle and terms management.
- `analytics.service.ts`: Spend Analytics and summary reporting.

## Infrastructure
- **PostgreSQL**: Primary data store.
- **Redis**: Caching and background job support.
- **Docker**: Containerized infrastructure for local development.
- **GitHub Actions**: Automated CI (lint, test, build).
