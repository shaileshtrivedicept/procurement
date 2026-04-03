# Deployment Guide - ERP Procurement Module (.NET Edition)

This guide covers deployment for the .NET 9 and SQL Server stack.

## 1. SQL Server Deployment

Required: **Microsoft SQL Server 2022+** or **Azure SQL Database**.

### Steps:
1. Provision a SQL Server instance.
2. Obtain the connection string.
3. Configure firewall rules to allow connections from your API server.

## 2. API Deployment (.NET 9.0)

### Azure App Service (Recommended)
1. Push code to GitHub.
2. Link Azure App Service to the repository.
3. Set **Configuration / Connection Strings**:
   - `DefaultConnection`: Your MSSQL connection string.
4. Set **Application Settings**:
   - `JWT_SECRET`: Your production security key.
   - `ASPNETCORE_ENVIRONMENT`: `Production`.

### Docker (Self-hosted)
1. Build image: `dotnet publish -c Release`.
2. Use the generated Dockerfile (or create one) to containerize the `dist` folder.
3. Run using Docker Compose or Kubernetes.

## 3. Frontend Deployment (Next.js 15)

Deploy to **Vercel** or **AWS Amplify**.

### Steps:
1. Connect GitHub repo.
2. Set Build Command: `npm run build`.
3. Set Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed .NET API URL (e.g., `https://api.procurement.com/api/v1`).

## 4. Post-Deployment

### Database Updates
Run migrations against the production database:
```bash
dotnet ef database update --project ProcurementERP.Infrastructure --startup-project ProcurementERP.Api --connection "YOUR_PROD_CONNECTION_STRING"
```
Or use idempotent SQL scripts generated via `dotnet ef migrations script`.
