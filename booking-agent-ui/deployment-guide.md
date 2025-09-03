# Deployment Guide for Booking Agent SaaS

Your Next.js application is now ready for deployment. Here are several deployment options:

## Option 1: Deploy with Vercel (Recommended for Next.js)
1. Push your code to GitHub
2. Visit https://vercel.com
3. Import your GitHub repository
4. Deploy with one click

## Option 2: Deploy with Docker
```bash
# Build the Docker image
docker build -t booking-agent-saas .

# Run locally
docker run -p 3000:3000 booking-agent-saas

# Or use docker-compose
docker-compose up -d
```

## Option 3: Deploy to VPS/Cloud Server
1. SSH into your server
2. Install Node.js 20+
3. Clone your repository
4. Run:
```bash
npm install
npm run build
npm start
```

## Option 4: Deploy with PM2 (Production Process Manager)
```bash
npm install -g pm2
npm run build
pm2 start npm --name "booking-agent" -- start
pm2 save
pm2 startup
```

## Option 5: Deploy to Cloud Platforms

### AWS EC2
- Launch an EC2 instance
- Install Node.js and nginx
- Clone repository and build
- Configure nginx as reverse proxy

### DigitalOcean App Platform
- Connect GitHub repository
- Select Node.js environment
- Deploy automatically on push

### Railway/Render
- Connect GitHub repository
- Auto-deploy on push
- Zero configuration needed

## Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

## Running the Application
- Development: `npm run dev`
- Production: `npm run build && npm start`
- Docker: `docker-compose up`

## Accessing the Application
- Business Dashboard: http://your-domain.com/business
- HQ Dashboard: http://your-domain.com/hq

## Port Configuration
Default port is 3000. Change with:
```bash
PORT=8080 npm start
```