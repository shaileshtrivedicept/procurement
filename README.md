# ERP Procurement Module (.NET Edition)

## Overview
This repository contains the full codebase for the ERP Procurement Module, covering the procure-to-pay lifecycle. Re-architected for **ASP.NET Core 9.0** and **SQL Server**.

## Tech Stack
- **Backend**: ASP.NET Core 9.0 Web API, Entity Framework Core (EF Core)
- **Database**: Microsoft SQL Server
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Axios
- **Infrastructure**: Docker Compose (MSSQL, Redis)
- **CI/CD**: GitHub Actions

## Project Structure
- `/apps/dotnet-api`: .NET 9.0 Backend Solution.
  - `ProcurementERP.Api`: Web API project with Controllers and Middleware.
  - `ProcurementERP.Core`: Domain models, Enums, and Core business logic.
  - `ProcurementERP.Infrastructure`: Data access (EF Core), DbContext, and Services.
- `/apps/web`: Next.js frontend application.
- `/docs`: Architecture, Deployment, and module documentation.

## Phase 1 Scope (Implemented)
- **Vendor Management**: CRUD with `VND-XXXXX` code generation.
- **Purchase Requisition**: Multi-line items, `PR-YYYY-XXXXX` numbering.
- **Approval Engine**: Data-driven rules based on amount slabs.
- **Audit Logging**: EF Core Interceptor based entity auditing.
- **Auth**: JWT-based Authentication with RBAC.

## Getting Started

### Prerequisites
- .NET 9 SDK
- Node.js (v20+)
- Docker Desktop

### Local Development
1. **Infrastructure**:
   ```bash
   docker-compose up -d
   ```

2. **Backend**:
   ```bash
   cd apps/dotnet-api
   dotnet restore
   dotnet build
   # Note: Ensure MSSQL is running then run:
   dotnet ef database update --project ProcurementERP.Infrastructure --startup-project ProcurementERP.Api
   dotnet run --project ProcurementERP.Api
   ```

3. **Frontend**:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

## Default Credentials
- **Admin**: `admin@erp.com` / `password123`
- **Port**: API runs on `http://localhost:5125` (Development)
