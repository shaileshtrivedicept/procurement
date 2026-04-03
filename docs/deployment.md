# Deployment Guide - ERP Procurement Module

This guide outlines the steps to deploy the ERP Procurement Module to production environments.

## 1. Database Deployment (PostgreSQL)

You need a managed PostgreSQL instance. Options include:
- **Supabase**: Easy setup, includes a connection string.
- **AWS RDS**: Production-grade, highly scalable.
- **DigitalOcean Managed Databases**: Simple and cost-effective.

### Steps:
1. Create a new PostgreSQL database instance.
2. Obtain the **Database URL** (e.g., `postgresql://user:password@host:port/dbname`).
3. Ensure the database is accessible from your backend deployment platform (check security groups/IP whitelisting).

## 2. Backend Deployment (NestJS API)

The backend can be deployed using Docker or as a Node.js application.

### Option A: AWS App Runner / Google Cloud Run (Docker)
1. Build the Docker image using the provided `Dockerfile` (you may need to create one for production).
2. Push the image to a container registry (ECR, GCR).
3. Create a service on the platform pointing to the image.
4. Set Environment Variables:
   - `DATABASE_URL`: Your production DB connection string.
   - `JWT_SECRET`: A strong, unique secret key.
   - `PORT`: 3001 (or as required by the platform).

### Option B: VPS (DigitalOcean / AWS EC2)
1. Clone the repository.
2. Install Docker and Docker Compose.
3. Run `docker-compose up -d`.
4. Use a reverse proxy like **Nginx** to handle SSL and forward traffic to the container.

## 3. Frontend Deployment (Next.js)

The easiest way to deploy the Next.js frontend is via **Vercel** or **Netlify**.

### Steps:
1. Connect your GitHub repository to Vercel.
2. Set the **Root Directory** to `apps/web`.
3. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL`: The URL of your deployed NestJS API (e.g., `https://api.yourdomain.com/api/v1`).
4. Vercel will automatically detect Next.js and handle the build and deployment.

## 4. Post-Deployment Configuration

### Database Migrations
After the backend is deployed, you must run Prisma migrations to set up the schema:
```bash
cd apps/api
npx prisma migrate deploy
npm run seed
```
(Most CI/CD pipelines or deployment platforms allow you to run these as "Build Commands" or "Post-deployment Scripts").

## 5. CI/CD Integration

The repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically:
1. Runs backend tests.
2. Verifies the frontend build.
3. You can extend this to include **Auto-deploy** steps to Vercel or AWS upon successful merge to `main`.

## Summary Checklist
- [ ] PostgreSQL is live and connection string is ready.
- [ ] Backend API is deployed and accessible via HTTPS.
- [ ] Frontend is deployed and pointing to the API URL.
- [ ] CORS is configured in the backend to allow your frontend domain.
- [ ] All environment variables are set in production consoles.
