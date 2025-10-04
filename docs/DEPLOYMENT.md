# Azure Deployment Guide

This guide explains how to deploy the Learning Management System to Microsoft Azure.

## Prerequisites

- Azure account with active subscription
- Azure CLI installed
- Node.js 18+ installed locally
- Git installed

## Deployment Options

### Option 1: Using Azure Portal

#### Step 1: Create Resource Group
1. Log in to [Azure Portal](https://portal.azure.com)
2. Click "Resource groups" > "Create"
3. Enter a name (e.g., `lms-resource-group`)
4. Select a region close to your users
5. Click "Review + Create" > "Create"

#### Step 2: Deploy Azure Resources
1. In the resource group, click "Create" > "Template deployment"
2. Click "Build your own template in the editor"
3. Upload `.azure/azuredeploy.json`
4. Click "Save"
5. Fill in the parameters:
   - Web App Name: `lms-app` (must be globally unique)
   - PostgreSQL Server Name: `lms-postgres-server` (must be globally unique)
   - PostgreSQL Admin Login: `lmsadmin`
   - PostgreSQL Admin Password: (create a secure password)
6. Click "Review + Create" > "Create"

#### Step 3: Configure Backend App Service
1. Navigate to the backend App Service (`lms-app-backend`)
2. Go to "Configuration" > "Application settings"
3. Add the following settings:
   ```
   DATABASE_URL=postgresql://lmsadmin@lms-postgres-server:PASSWORD@lms-postgres-server.postgres.database.azure.com/lms_db?sslmode=require
   JWT_SECRET=your-secure-jwt-secret
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=https://lms-app-frontend.azurewebsites.net
   ```
4. Click "Save"

#### Step 4: Configure Frontend App Service
1. Navigate to the frontend App Service (`lms-app-frontend`)
2. Go to "Configuration" > "Application settings"
3. Add the following settings:
   ```
   NEXT_PUBLIC_API_URL=https://lms-app-backend.azurewebsites.net/api
   ```
4. Click "Save"

#### Step 5: Deploy Code

**Backend:**
```bash
cd backend
npm install
npm run build

# Install Azure CLI if not already installed
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login to Azure
az login

# Deploy backend
az webapp deployment source config-zip \
  --resource-group lms-resource-group \
  --name lms-app-backend \
  --src backend.zip
```

**Frontend:**
```bash
cd frontend
npm install
npm run build

az webapp deployment source config-zip \
  --resource-group lms-resource-group \
  --name lms-app-frontend \
  --src frontend.zip
```

#### Step 6: Run Database Migrations
1. In Azure Portal, go to the backend App Service
2. Open "SSH" or "Console"
3. Run:
   ```bash
   cd /home/site/wwwroot
   npx prisma migrate deploy
   npx prisma generate
   ```

### Option 2: Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create \
  --name lms-resource-group \
  --location eastus

# Deploy Azure resources
az deployment group create \
  --resource-group lms-resource-group \
  --template-file .azure/azuredeploy.json \
  --parameters .azure/azuredeploy.parameters.json

# Configure backend app settings
az webapp config appsettings set \
  --resource-group lms-resource-group \
  --name lms-app-backend \
  --settings \
    DATABASE_URL="postgresql://..." \
    JWT_SECRET="your-secret" \
    NODE_ENV="production"

# Configure frontend app settings
az webapp config appsettings set \
  --resource-group lms-resource-group \
  --name lms-app-frontend \
  --settings \
    NEXT_PUBLIC_API_URL="https://lms-app-backend.azurewebsites.net/api"

# Deploy backend
cd backend
npm install && npm run build
zip -r backend.zip .
az webapp deployment source config-zip \
  --resource-group lms-resource-group \
  --name lms-app-backend \
  --src backend.zip

# Deploy frontend
cd ../frontend
npm install && npm run build
zip -r frontend.zip .
az webapp deployment source config-zip \
  --resource-group lms-resource-group \
  --name lms-app-frontend \
  --src frontend.zip
```

### Option 3: Using GitHub Actions (CI/CD)

1. **Get Publish Profiles:**
   - Go to Azure Portal
   - Navigate to each App Service (backend and frontend)
   - Click "Download publish profile"
   - Save the XML content

2. **Add GitHub Secrets:**
   - Go to your GitHub repository
   - Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `AZURE_BACKEND_PUBLISH_PROFILE`: Content of backend publish profile
     - `AZURE_FRONTEND_PUBLISH_PROFILE`: Content of frontend publish profile

3. **Push to main branch:**
   ```bash
   git push origin main
   ```
   
   The GitHub Actions workflow will automatically deploy both frontend and backend.

## Database Configuration

### Allow Azure Services
1. Go to PostgreSQL server in Azure Portal
2. Navigate to "Connection security"
3. Enable "Allow access to Azure services"
4. Add your IP address for local access (optional)
5. Click "Save"

### Run Migrations
After deployment, run Prisma migrations:

```bash
# Using Azure Cloud Shell or SSH
cd /home/site/wwwroot
npx prisma migrate deploy
npx prisma generate
```

## Post-Deployment

### Verify Deployment
1. Backend health check: `https://lms-app-backend.azurewebsites.net/health`
2. Frontend: `https://lms-app-frontend.azurewebsites.net`

### Create First Admin User
Use an API client (Postman, curl) to create the first admin:

```bash
curl -X POST https://lms-app-backend.azurewebsites.net/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123",
    "name": "Admin User",
    "role": "ADMIN"
  }'
```

## Monitoring

### Application Insights
1. Navigate to App Service in Azure Portal
2. Go to "Application Insights"
3. Click "Turn on Application Insights"
4. Follow the wizard to enable monitoring

### View Logs
```bash
# Stream backend logs
az webapp log tail \
  --resource-group lms-resource-group \
  --name lms-app-backend

# Stream frontend logs
az webapp log tail \
  --resource-group lms-resource-group \
  --name lms-app-frontend
```

## Scaling

### Vertical Scaling (Scale Up)
1. Go to App Service Plan in Azure Portal
2. Click "Scale up (App Service plan)"
3. Select a higher tier (e.g., S1, P1V2)

### Horizontal Scaling (Scale Out)
1. Go to App Service in Azure Portal
2. Click "Scale out (App Service plan)"
3. Configure auto-scaling rules or manual instance count

## Security Best Practices

1. **Use Key Vault for Secrets:**
   - Store JWT_SECRET and database credentials in Azure Key Vault
   - Reference them in App Service configuration

2. **Enable HTTPS Only:**
   - In App Service, go to "TLS/SSL settings"
   - Enable "HTTPS Only"

3. **Configure Custom Domain:**
   - Add custom domain in App Service
   - Enable managed SSL certificate

4. **Enable Authentication:**
   - Consider enabling Azure AD authentication for additional security

## Troubleshooting

### Backend not starting
- Check application logs in Azure Portal
- Verify DATABASE_URL is correct
- Ensure Prisma migrations have run

### Frontend showing errors
- Check that NEXT_PUBLIC_API_URL is correct
- Verify backend is accessible
- Check browser console for errors

### Database connection issues
- Verify firewall rules allow App Service
- Check connection string format
- Ensure SSL mode is enabled

## Cost Optimization

1. Use App Service B1 tier for development/testing
2. Scale to higher tiers only for production
3. Use Azure SQL Database Serverless for dev/test
4. Stop App Services when not in use (dev environments)
5. Monitor costs with Azure Cost Management

## Backup and Recovery

1. **Enable App Service Backups:**
   - Go to App Service > Backups
   - Configure automated backups

2. **Database Backups:**
   - PostgreSQL automatically backs up
   - Configure retention period in server settings

3. **Export Database:**
   ```bash
   pg_dump -h lms-postgres-server.postgres.database.azure.com \
     -U lmsadmin@lms-postgres-server \
     -d lms_db > backup.sql
   ```
