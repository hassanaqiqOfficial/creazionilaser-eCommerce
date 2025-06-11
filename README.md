# E-Commerce Platform

A full-stack e-commerce platform for custom products with artist marketplace integration.

## Features

- Browse custom products (T-shirts, laser-engraved items, vinyl stickers, keychains)
- Local shopping cart functionality
- Artist community showcase
- Product customization options
- Responsive design with dark/light mode

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: shadcn/ui, Radix UI

## Deployment to Render

### Prerequisites

1. A [Render](https://render.com) account
2. Your code in a Git repository (GitHub, GitLab, or Bitbucket)

### Step-by-Step Deployment

1. **Push your code to a Git repository**
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. **Create a PostgreSQL database on Render**
   - Go to your Render dashboard
   - Click "New +" → "PostgreSQL"
   - Name: `ecommerce-db`
   - Select a plan (Free tier available)
   - Click "Create Database"
   - Save the database connection string

3. **Deploy the web service**
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Configure the service:
     - **Name**: `ecommerce-platform`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Auto-Deploy**: Yes (recommended)

4. **Set environment variables**
   - In your web service settings, add:
     - `NODE_ENV`: `production`
     - `DATABASE_URL`: [Your PostgreSQL connection string from step 2]

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### Alternative: Blueprint Deployment

If you prefer using Render's Blueprint feature:

1. Keep the `render.yaml` file in your repository
2. In Render dashboard, click "New +" → "Blueprint"
3. Connect your repository and Render will use the blueprint configuration

### Environment Variables Required

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to `production`

### Database Setup

The application automatically creates and seeds the database on first run. No manual database setup required.

## Local Development

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5000`

## Production Build

```bash
npm run build
npm start
```