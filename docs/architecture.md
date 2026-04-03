# Architecture Summary - ERP Procurement Module (.NET Edition)

## Backend (.NET 9.0)
- **Clean Architecture**: Divided into API (Entry), Core (Domain), and Infrastructure (Data/Services).
- **Security**: ASP.NET Core Identity/JWT with custom RBAC middleware.
- **ORM**: Entity Framework Core with SQL Server.
- **Rules Engine**: JSON-backed rules evaluated in C# for tiered approval routing.
- **Audit Logging**: Automatic capture of `Added`, `Modified`, and `Deleted` states using EF Core SaveChanges interceptor.

## Frontend (Next.js 15)
- **Framework**: Next.js (App Router) with TypeScript.
- **Styling**: Tailwind CSS for ERP-standard UI.
- **Integration**: Axios client connected to .NET Web API endpoints.

## Database (SQL Server)
- **Schema**: Users, Roles, Departments, Vendors, Purchase Requisitions, PR Items, Approvals, Audit Logs, Rules.
- **Indexes**: Unique constraints on Vendor Codes and PR Numbers.
- **Precision**: 18,2 precision for all financial/quantity fields.

## Deployment Stack
- **API**: ASP.NET Core (Containerized).
- **Web**: Next.js (Vercel/Static).
- **DB**: Microsoft SQL Server.
- **Cache**: Redis.
