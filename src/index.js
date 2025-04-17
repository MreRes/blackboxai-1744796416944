require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const { GoogleSheetService } = require('./googleSheetService');
const { AiGeminiService } = require('./aiGeminiService');
const whatsappRoutes = require('./routes/whatsappRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize services
const googleSheetService = new GoogleSheetService();
const aiGeminiService = new AiGeminiService();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Routes
app.use('/webhook', whatsappRoutes);

// Admin dashboard route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

// API endpoint for dashboard data
app.get('/api/admin/data', async (req, res) => {
    try {
        const report = await googleSheetService.getMonthlyReport();
        res.json(report);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Redirect root to /admin
app.get('/', (req, res) => {
    res.redirect('/admin');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Dashboard available at http://localhost:${PORT}/admin`);
});

module.exports = app;
