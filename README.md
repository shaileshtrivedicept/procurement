# ERP Procurement Module

## Overview
This repository contains the full codebase for the ERP Procurement Module, covering the procure-to-pay lifecycle. Built with a production-ready monorepo structure.

## Tech Stack
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, Axios
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL (Prisma)
- **Cache**: Redis
- **CI/CD**: GitHub Actions

## Project Structure
- `/apps/web`: Next.js frontend application.
- `/apps/api`: NestJS backend application.
- `/docs`: Architecture, ERD, and module documentation.
- `/scripts`: Utility and seed scripts.

## Phase 1 Scope (Implemented)
- **Vendor Management**: Full CRUD with custom numbering (`VND-XXXXX`).
- **Purchase Requisition**: Multi-line item entry, automated numbering (`PR-YYYY-XXXXX`), status tracking.
- **Rules Engine**: Data-driven approval routing based on value slabs.
- **Audit Logging**: Global capture of all state changes across core entities.
- **Auth & RBAC**: JWT-based authentication with role-based access control.

## Getting Started

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose

### Local Development
1. **Infrastructure**: Start PostgreSQL and Redis:
   ```bash
   docker-compose up -d
   ```

2. **Backend**:
   ```bash
   cd apps/api
   npm install
   # Configure .env based on .env.example
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   npm run start:dev
   ```

3. **Frontend**:
   ```bash
   cd apps/web
   npm install
   # Configure .env based on .env.example
   npm run dev
   ```

### Default Credentials
- **Admin**: `admin@erp.com` / `password123`
- **Department Head**: `dept_head@erp.com` / `password123`

## Phase 2-4 Roadmap (Scaffolded)
- **Phase 2**: RFQ Lifecycle and Vendor Bidding.
- **Phase 3**: PO Generation, GRN, and 3-Way Matching.
- **Phase 4**: Contract Management and Spend Analytics.

## Documentation
Refer to `/docs` for detailed architecture, ERDs, and roadmap details.
