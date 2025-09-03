# Deploy to Render - Step by Step Guide

## Prerequisites
- GitHub account
- Render account (sign up at https://render.com)

## Step 1: Push to GitHub

First, create a new repository on GitHub and push your code:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Ready for Render deployment"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/booking-agent-ui.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy on Render

### Option A: Automatic Deployment (Recommended)

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub account if not already connected
4. Select your `booking-agent-ui` repository
5. Fill in the following settings:
   - **Name**: booking-agent-saas (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free tier to start (can upgrade later)

6. Click "Create Web Service"

### Option B: Manual Deployment via render.yaml

Since we have a `render.yaml` file configured, you can also:

1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to create the service

## Step 3: Environment Variables (Optional)

If you need to add environment variables:

1. In Render Dashboard, go to your service
2. Click "Environment" in the left sidebar
3. Add variables as needed:
   - Click "Add Environment Variable"
   - Enter key and value
   - Click "Save Changes"

## Step 4: Custom Domain (Optional)

To add a custom domain:

1. In your service dashboard, go to "Settings"
2. Scroll to "Custom Domains"
3. Add your domain and follow DNS configuration instructions

## Monitoring Your Deployment

1. Watch the deploy logs in Render Dashboard
2. First deployment may take 5-10 minutes
3. Once complete, you'll get a URL like: `https://booking-agent-saas.onrender.com`

## Accessing Your App

After successful deployment:
- Main page: `https://your-app.onrender.com/`
- Business Dashboard: `https://your-app.onrender.com/business`
- HQ Dashboard: `https://your-app.onrender.com/hq`

## Troubleshooting

If deployment fails:

1. Check the deploy logs in Render Dashboard
2. Ensure Node version is compatible (we're using Node 20)
3. Verify all dependencies are in package.json
4. Check that build completes locally with `npm run build`

## Auto-Deploy Setup

Render automatically deploys when you push to GitHub:
- Every push to main branch triggers a new deployment
- You can disable auto-deploy in Settings if preferred

## Free Tier Limitations

Note: Render's free tier services:
- Spin down after 15 minutes of inactivity
- May take 30-60 seconds to spin back up on first request
- Limited to 750 hours/month

For production use, consider upgrading to a paid plan for:
- Always-on services
- Better performance
- Custom domains with SSL
- More build minutes

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Status Page: https://status.render.com