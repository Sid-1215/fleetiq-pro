# 🚀 FleetIQ Pro - Render.com Deployment Guide

Deploy your AI-powered fleet management system to Render.com for live hackathon demos!

## 🌐 Deployment Options

### Option 1: Single Service Deployment (Recommended for Hackathons)
Deploy both frontend and backend as one service - easier setup!

### Option 2: Separate Services
Deploy frontend and backend separately - better for production scaling

---

## 🚀 Option 1: Single Service Deployment

### Step 1: Prepare Repository
```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your repository

### Step 3: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

```
Name: fleetiq-pro
Environment: Node
Region: Oregon (US West) or your preferred region
Branch: main
Build Command: npm install && cd frontend && npm install && npm run build
Start Command: npm start
```

### Step 4: Environment Variables
Add these environment variables in Render dashboard:

```bash
NODE_ENV=production
PORT=10000
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=https://your-app-name.onrender.com
```

### Step 5: Deploy!
Click **"Create Web Service"** and wait for deployment (5-10 minutes)

---

## 🏗️ Option 2: Separate Services Deployment

### Backend Service
1. **Create Web Service** for backend:
```
Name: fleetiq-backend
Build Command: npm install
Start Command: npm start
Environment Variables:
  - NODE_ENV=production
  - PORT=10000
  - OPENAI_API_KEY=your_key_here
```

### Frontend Service
2. **Create Static Site** for frontend:
```
Name: fleetiq-frontend
Build Command: cd frontend && npm install && npm run build
Publish Directory: frontend/build
Environment Variables:
  - REACT_APP_API_URL=https://fleetiq-backend.onrender.com
```

---

## 🔧 Advanced Configuration

### Custom Build Script
If you want more control, create a `render-build.sh`:

```bash
#!/bin/bash
echo "🚀 Building FleetIQ Pro for production..."

# Install dependencies
npm install

# Build frontend
cd frontend
npm install
npm run build
cd ..

echo "✅ Build complete!"
```

### Using render.yaml (Auto-Deploy)
Place `render.yaml` in your repo root for automatic configuration:

```yaml
services:
  - type: web
    name: fleetiq-pro
    env: node
    buildCommand: npm install && cd frontend && npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: OPENAI_API_KEY
        sync: false
```

---

## 🔑 Getting Your OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account / Sign in
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-`)
6. Add to Render environment variables

**Important**: Keep your API key secure! Don't commit it to GitHub.

---

## 🎯 Live Demo URLs

After deployment, you'll get URLs like:
- **Single Service**: `https://fleetiq-pro.onrender.com`
- **Backend Only**: `https://fleetiq-backend.onrender.com`
- **Frontend Only**: `https://fleetiq-frontend.onrender.com`

### Quick Health Check
Visit your backend URL + `/api/health` to verify deployment:
```
https://your-app.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "FleetIQ Backend is running",
  "environment": "production",
  "features": {
    "openai": true,
    "tensorflow": true
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failing
```bash
Error: Module not found
Solution: Check package.json scripts and dependencies
```

#### 2. OpenAI API Errors
```bash
Error: OpenAI API key not set
Solution: Add OPENAI_API_KEY to environment variables
```

#### 3. Frontend Not Loading
```bash
Error: Cannot GET /
Solution: Check that frontend build completed successfully
```

#### 4. CORS Issues
```bash
Error: CORS policy blocked
Solution: Verify FRONTEND_URL environment variable
```

### Debug Steps
1. **Check Render Logs**: Go to your service → Logs tab
2. **Verify Environment Variables**: Settings → Environment
3. **Test API Endpoints**: Use curl or Postman
4. **Check Build Output**: Review build logs for errors

---

## 📊 Monitoring Your Deployment

### Render Dashboard
- **Metrics**: CPU, Memory, Response times
- **Logs**: Real-time application logs
- **Events**: Deployment history

### Health Monitoring
The app includes built-in health checks:
- `/api/health` - Basic health status
- Built-in error handling and fallbacks
- TensorFlow.js status monitoring

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] OpenAI API key obtained
- [ ] Environment variables documented
- [ ] Build scripts tested locally

### During Deployment
- [ ] Render service created
- [ ] Environment variables set
- [ ] Build completed successfully
- [ ] Health check passing

### Post-Deployment
- [ ] Frontend loads correctly
- [ ] AI features working
- [ ] Interactive map displaying
- [ ] Add/remove vehicles functional

---

## 🎉 Demo Day Tips

### Before Your Presentation
1. **Test Your Live App**: Verify all features work
2. **Prepare Backup**: Have local version ready
3. **Document URLs**: Share easy-to-remember URLs
4. **Check Performance**: Ensure fast loading

### During Demo
1. **Start with Live URL**: Show it's actually deployed
2. **Demonstrate AI Features**: Generate real insights
3. **Show Interactive Elements**: Add vehicles, view map
4. **Highlight Tech Stack**: Mention OpenAI + TensorFlow.js

### Impressive Demo Flow
1. **Open live app** → "This is deployed on Render"
2. **Generate AI insights** → "Real OpenAI GPT-4 integration"
3. **Add new vehicle** → "Dynamic fleet management"
4. **Show predictions** → "TensorFlow.js machine learning"
5. **Interactive map** → "Real-time tracking simulation"

---

## 💰 Cost Information

### Render Free Tier
- **750 hours/month** of runtime
- **Perfect for hackathons** and demos
- **Sleeps after 15 minutes** of inactivity
- **Wake-up time**: ~30 seconds

### Keeping Your App Awake
For important demos, consider:
1. **Paid Plan**: $7/month for always-on
2. **Ping Service**: Use UptimeRobot to ping your app
3. **Demo Prep**: Load app before presenting

---

## 🔗 Useful Links

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **OpenAI Platform**: [platform.openai.com](https://platform.openai.com)
- **GitHub Repository**: [Your repo URL]
- **Live Demo**: [Your Render URL]

---

## 🆘 Need Help?

### Quick Support
- **Render Support**: [render.com/support](https://render.com/support)
- **GitHub Issues**: Create an issue in your repo
- **Discord/Slack**: Share your render logs

### Emergency Backup
If deployment fails, you can always run locally:
```bash
npm run dev:full
# Share via ngrok: ngrok http 3000
```

---

**🚀 You're ready to deploy! Show the judges your AI-powered fleet management system running live in the cloud!**