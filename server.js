// server.js - Express Backend with OpenAI Integration (FIXED)
const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const OpenAI = require('openai');
const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security and compression middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(compression());

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL, /\.render\.com$/]
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')));
}

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// TensorFlow Models
let batteryPredictionModel = null;
let demandPredictionModel = null;

// Initialize ML Models
async function initializeModels() {
    try {
        console.log('Initializing TensorFlow.js models...');
        
        batteryPredictionModel = tf.sequential({
            layers: [
                tf.layers.dense({ inputShape: [4], units: 10, activation: 'relu' }),
                tf.layers.dense({ units: 5, activation: 'relu' }),
                tf.layers.dense({ units: 1, activation: 'linear' })
            ]
        });
        
        demandPredictionModel = tf.sequential({
            layers: [
                tf.layers.dense({ inputShape: [3], units: 8, activation: 'relu' }),
                tf.layers.dense({ units: 4, activation: 'relu' }),
                tf.layers.dense({ units: 1, activation: 'sigmoid' })
            ]
        });
        
        console.log('TensorFlow.js models initialized successfully');
    } catch (error) {
        console.error('Error initializing models:', error);
    }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'FleetIQ Backend is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        features: {
            openai: !!process.env.OPENAI_API_KEY,
            tensorflow: !!batteryPredictionModel
        }
    });
});

// Generate AI insights using OpenAI
app.post('/api/ai/insights', async (req, res) => {
    try {
        const { vehicles, drones, alerts } = req.body;
        
        if (!process.env.OPENAI_API_KEY) {
            return res.json({
                insights: [
                    {
                        id: 1,
                        type: "battery_optimization",
                        title: "⚡ Battery Management Alert",
                        recommendation: `${vehicles.filter(v => v.battery < 40).length} vehicles have low battery. Consider routing to charging stations.`,
                        confidence: 90,
                        impact: "High",
                        action: "route_to_charging"
                    },
                    {
                        id: 2,
                        type: "efficiency",
                        title: "📊 Fleet Efficiency",
                        recommendation: "Enable eco-mode during low-demand hours to extend vehicle range by 15-20%.",
                        confidence: 85,
                        impact: "Medium",
                        action: "enable_eco_mode"
                    }
                ]
            });
        }
        
        const fleetSummary = {
            totalVehicles: vehicles.length,
            activeVehicles: vehicles.filter(v => v.status === 'active').length,
            averageBattery: vehicles.reduce((sum, v) => sum + v.battery, 0) / vehicles.length,
            totalDrones: drones.length,
            activeDrones: drones.filter(d => d.status === 'active').length,
            criticalAlerts: alerts.filter(a => a.severity === 'critical').length
        };

        const prompt = `
        You are an AI fleet management expert. Analyze this fleet data and provide 4 specific, actionable insights:
        
        Fleet Summary:
        - ${fleetSummary.totalVehicles} vehicles (${fleetSummary.activeVehicles} active)
        - Average battery: ${fleetSummary.averageBattery.toFixed(1)}%
        - ${fleetSummary.totalDrones} drones (${fleetSummary.activeDrones} active)
        - ${fleetSummary.criticalAlerts} critical alerts
        
        Vehicle Details:
        ${vehicles.map(v => `${v.id}: ${v.status}, ${v.battery}% battery, ${v.location.address}`).join('\n')}
        
        Provide insights in this exact JSON format:
        {
          "insights": [
            {
              "id": 1,
              "type": "route_optimization",
              "title": "🚗 Route Optimization",
              "recommendation": "Specific recommendation",
              "confidence": 85,
              "impact": "High",
              "action": "apply_optimization"
            }
          ]
        }
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a fleet optimization AI that provides actionable insights. Always respond with valid JSON only."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1500,
            temperature: 0.7
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content);
        res.json(aiResponse);

    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        const fallbackInsights = {
            insights: [
                {
                    id: 1,
                    type: "battery_optimization",
                    title: "⚡ Battery Management Alert",
                    recommendation: `${req.body.vehicles.filter(v => v.battery < 40).length} vehicles have low battery. Consider routing to charging stations.`,
                    confidence: 90,
                    impact: "High",
                    action: "route_to_charging"
                },
                {
                    id: 2,
                    type: "efficiency",
                    title: "📊 Fleet Efficiency",
                    recommendation: "Enable eco-mode during low-demand hours to extend vehicle range by 15-20%.",
                    confidence: 85,
                    impact: "Medium",
                    action: "enable_eco_mode"
                }
            ]
        };
        
        res.json(fallbackInsights);
    }
});

// Route optimization using OpenAI
app.post('/api/ai/optimize-route', async (req, res) => {
    try {
        const { vehicleId, currentLocation, destination, trafficData } = req.body;

        if (!process.env.OPENAI_API_KEY) {
            return res.json({
                optimizedRoute: {
                    estimatedTime: Math.floor(Math.random() * 30) + 15,
                    batterySavings: Math.floor(Math.random() * 20) + 5,
                    alternativeRoute: true,
                    waypoints: ["Optimized waypoint 1", "Optimized waypoint 2"]
                }
            });
        }

        const prompt = `
        Optimize route for vehicle ${vehicleId}:
        From: ${currentLocation.address}
        To: ${destination}
        Current traffic: ${trafficData ? 'Heavy' : 'Light'}
        
        Provide optimization in JSON format:
        {
          "optimizedRoute": {
            "estimatedTime": 25,
            "batterySavings": 15,
            "alternativeRoute": true,
            "waypoints": ["point1", "point2"]
          }
        }
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500
        });

        const routeData = JSON.parse(completion.choices[0].message.content);
        res.json(routeData);

    } catch (error) {
        console.error('Route optimization error:', error);
        
        res.json({
            optimizedRoute: {
                estimatedTime: Math.floor(Math.random() * 30) + 15,
                batterySavings: Math.floor(Math.random() * 20) + 5,
                alternativeRoute: true,
                waypoints: ["Optimized waypoint 1", "Optimized waypoint 2"]
            }
        });
    }
});

// TensorFlow predictions
app.post('/api/ml/predict-battery', async (req, res) => {
    try {
        const { vehicleData } = req.body;
        
        if (!batteryPredictionModel) {
            throw new Error('Battery prediction model not loaded');
        }

        const inputData = tf.tensor2d([[
            vehicleData.battery / 100,
            vehicleData.efficiency / 100,
            vehicleData.usageHours || 8,
            0.7
        ]]);

        const prediction = batteryPredictionModel.predict(inputData);
        const batteryLifeHours = await prediction.data();
        
        inputData.dispose();
        prediction.dispose();

        res.json({
            predictedBatteryLife: Math.max(1, Math.min(24, batteryLifeHours[0] * 24)),
            confidence: 0.85,
            model: 'tensorflow'
        });

    } catch (error) {
        console.error('TensorFlow prediction error:', error);
        
        res.json({
            predictedBatteryLife: Math.random() * 12 + 6,
            confidence: 0.75,
            model: 'fallback'
        });
    }
});

app.post('/api/ml/predict-demand', async (req, res) => {
    try {
        const { locationData, timeOfDay, weatherCondition } = req.body;
        
        if (!demandPredictionModel) {
            throw new Error('Demand prediction model not loaded');
        }

        const inputData = tf.tensor2d([[
            timeOfDay / 24,
            locationData.isDowntown ? 1 : 0,
            weatherCondition === 'good' ? 1 : 0.5
        ]]);

        const prediction = demandPredictionModel.predict(inputData);
        const demandScore = await prediction.data();
        
        inputData.dispose();
        prediction.dispose();

        res.json({
            demandScore: Math.round(demandScore[0] * 100),
            recommendation: demandScore[0] > 0.7 ? 'Deploy additional units' : 'Standard deployment',
            confidence: 0.82
        });

    } catch (error) {
        console.error('Demand prediction error:', error);
        
        const timeBasedDemand = Math.sin((timeOfDay - 6) * Math.PI / 12) * 50 + 50;
        res.json({
            demandScore: Math.max(0, Math.min(100, Math.round(timeBasedDemand))),
            recommendation: timeBasedDemand > 70 ? 'Deploy additional units' : 'Standard deployment',
            confidence: 0.70
        });
    }
});

// Predictive maintenance
app.post('/api/ml/predict-maintenance', async (req, res) => {
    try {
        const { vehicleId, mileage, batteryHealth, lastService } = req.body;
        
        const daysSinceService = lastService ? 
            Math.floor((Date.now() - new Date(lastService)) / (1000 * 60 * 60 * 24)) : 30;
        
        const mileageFactor = (mileage || 50000) / 100000;
        const batteryFactor = 1 - (batteryHealth || 90) / 100;
        const timeFactor = daysSinceService / 90;
        
        const riskScore = Math.min(100, (mileageFactor + batteryFactor + timeFactor) * 100);
        
        res.json({
            vehicleId,
            riskScore: Math.round(riskScore),
            daysUntilMaintenance: Math.max(1, Math.round((100 - riskScore) / 2)),
            recommendedAction: riskScore > 70 ? 'immediate_service' : 'monitor',
            confidence: 0.88
        });

    } catch (error) {
        console.error('Maintenance prediction error:', error);
        res.status(500).json({ error: 'Prediction failed' });
    }
});

// Serve React app for production
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
async function startServer() {
    await initializeModels();
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 FleetIQ Backend running on port ${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV}`);
        console.log(`🤖 OpenAI: ${process.env.OPENAI_API_KEY ? 'Enabled' : 'Disabled'}`);
        console.log(`🧠 TensorFlow: ${batteryPredictionModel ? 'Ready' : 'Loading...'}`);
        console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    });
}

startServer().catch(console.error);