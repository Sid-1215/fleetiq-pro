# FleetIQ Pro - AI-Powered Fleet Management System

🚗 **Autonomous Vehicle & Drone Fleet Management with Real AI Integration**

A comprehensive fleet management platform built for hackathons, featuring real OpenAI API integration, TensorFlow.js machine learning, and interactive real-time tracking.

## 🌟 Features

### 🤖 **Real AI Integration**
- **OpenAI GPT-4** for intelligent fleet insights and optimization recommendations
- **TensorFlow.js** client-side machine learning for real-time predictions
- **Predictive Maintenance** using ML models
- **Route Optimization** with AI-powered suggestions

### 🗺️ **Interactive Fleet Tracking**
- Real-time animated map with vehicle and drone tracking
- Live route visualization and waypoint management
- Battery level monitoring with color-coded indicators
- Charging station and traffic light visualization

### 📊 **Advanced Analytics**
- Real-time fleet performance metrics
- ML-powered demand prediction
- Battery life optimization
- Revenue tracking and optimization

### 🚀 **Fleet Management**
- Add/remove vehicles and drones dynamically
- Real-time status updates (Active, Charging, Maintenance)
- Alert system with severity levels
- Comprehensive fleet dashboard

## 🛠️ Tech Stack

### **Backend**
- **Node.js** + Express.js
- **OpenAI API** (GPT-4) for AI insights
- **TensorFlow.js Node** for server-side ML
- **RESTful APIs** for fleet management

### **Frontend**
- **React 18** with modern hooks
- **TensorFlow.js** for client-side predictions
- **Tailwind CSS** for responsive design
- **Lucide React** for icons
- **Canvas API** for interactive maps

### **AI/ML Stack**
- **OpenAI GPT-4** - Natural language AI insights
- **TensorFlow.js** - Machine learning predictions
- **Predictive Models** - Battery life, maintenance, demand forecasting

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm 8+
- OpenAI API key

### 1. Clone Repository
```bash
git clone https://github.com/your-username/fleetiq-pro.git
cd fleetiq-pro
```

### 2. Environment Setup
Create `.env` file in root directory:
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Optional: Additional API Keys
MAPBOX_API_KEY=your_mapbox_key (for production maps)
```

### 3. Install Dependencies
```bash
# Install backend dependencies
npm run install:all

# Or install manually
npm install
cd frontend && npm install
```

### 4. Start Development Environment
```bash
# Start both backend and frontend
npm run dev:full

# Or start separately
npm run dev          # Backend only (port 3001)
cd frontend && npm start  # Frontend only (port 3000)
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📁 Project Structure

```
fleetiq-pro/
├── README.md
├── package.json
├── server.js                 # Express backend server
├── .env                      # Environment variables
├── .gitignore
├── frontend/
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── App.js           # Main React application
│   │   ├── App.css          # Global styles
│   │   ├── components/
│   │   │   ├── InteractiveMap.js      # Real-time map component
│   │   │   ├── AIInsightsDashboard.js # AI insights panel
│   │   │   ├── FleetCard.js           # Vehicle/drone cards
│   │   │   ├── AddUnitModal.js        # Add vehicle/drone modal
│   │   │   ├── StatsCard.js           # Statistics cards
│   │   │   └── AlertCard.js           # Alert notifications
│   │   └── services/
│   │       ├── api.js       # API service layer
│   │       └── websocket.js # Real-time updates
└── docs/                    # Documentation
```

## 🔑 API Endpoints

### **AI Endpoints**
```
POST /api/ai/insights          # Generate AI fleet insights
POST /api/ai/optimize-route    # Route optimization
```

### **Machine Learning Endpoints**
```
POST /api/ml/predict-battery   # Battery life prediction
POST /api/ml/predict-demand    # Demand forecasting
POST /api/ml/predict-maintenance # Maintenance predictions
```

### **Fleet Management Endpoints**
```
GET  /api/fleet/status         # Fleet status
POST /api/fleet/vehicle        # Add vehicle
PATCH /api/fleet/vehicle/:id   # Update vehicle
DELETE /api/fleet/vehicle/:id  # Remove vehicle
```

## 🤖 AI Features Explained

### **1. OpenAI Integration**
The system uses GPT-4 to analyze fleet data and generate human-readable insights:
```javascript
const insights = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
        role: "system",
        content: "You are a fleet optimization AI..."
    }]
});
```

### **2. TensorFlow.js Predictions**
Client-side machine learning for real-time predictions:
```javascript
// Battery life prediction
const model = tf.sequential({
    layers: [
        tf.layers.dense({ inputShape: [4], units: 10, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
    ]
});
```

### **3. Predictive Maintenance**
ML-powered maintenance scheduling based on:
- Vehicle mileage and usage patterns
- Battery health degradation
- Historical maintenance data
- Real-time sensor data simulation

## 🎨 UI Components

### **Interactive Map**
- Real-time vehicle and drone tracking
- Animated movement simulation
- Route visualization with waypoints
- Charging station indicators
- Click-to-select functionality

### **AI Dashboard**
- Real-time insight generation
- Confidence scoring for predictions
- Actionable recommendations
- ML model status indicators

### **Fleet Cards**
- Battery level with progress bars
- Real-time efficiency metrics
- ML risk assessments
- Quick action buttons

## 🔧 Configuration Options

### **AI Configuration**
```javascript
// Adjust AI model parameters
const AI_CONFIG = {
    model: "gpt-4",
    temperature: 0.7,
    max_tokens: 1500
};
```

### **ML Configuration**
```javascript
// TensorFlow.js model settings
const ML_CONFIG = {
    batchSize: 32,
    epochs: 100,
    learningRate: 0.001
};
```

## 🚀 Deployment

### **Development**
```bash
npm run dev:full
```

### **Production Build**
```bash
npm run build
npm start
```

### **Docker Deployment**
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### **Environment Variables for Production**
```bash
OPENAI_API_KEY=your_production_key
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com
```

## 🎯 Hackathon Demo Tips

### **1. Show Real AI in Action**
- Generate live insights using OpenAI
- Demonstrate TensorFlow.js predictions
- Show confidence scores and reasoning

### **2. Interactive Features**
- Add vehicles/drones live
- Show real-time map updates
- Execute AI recommendations

### **3. Technical Highlights**
- Explain AI integration architecture
- Show code structure for teamwork
- Demonstrate scalability features

### **4. Business Value**
- Cost savings through optimization
- Predictive maintenance benefits
- Revenue optimization potential

## 🤝 Contributing

### **Team Collaboration**
1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Code Standards**
- Use ESLint and Prettier
- Follow React best practices
- Comment AI/ML logic clearly
- Test API endpoints

## 📝 License

MIT License - feel free to use for hackathons and learning!

## 🆘 Troubleshooting

### **Common Issues**

1. **OpenAI API Errors**
   ```bash
   Error: OpenAI API key not found
   Solution: Add OPENAI_API_KEY to .env file
   ```

2. **TensorFlow.js Loading Issues**
   ```bash
   Error: TensorFlow.js not ready
   Solution: Wait for tf.ready() promise
   ```

3. **Port Conflicts**
   ```bash
   Error: Port 3001 in use
   Solution: Change PORT in .env or kill process
   ```

## 🎉 Credits

Built for hackathons by developers who believe in the power of AI to transform transportation.

**Technologies**: OpenAI GPT-4, TensorFlow.js, React, Node.js, Express

---

### 🚀 Ready to revolutionize fleet management with AI? Let's build the future! 🤖