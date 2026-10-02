const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const initializeDatabase = require('./config/initDb');

// Import routes
const authRoutes = require('./routes/authRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const mapRoutes = require('./routes/mapRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SafeRoad AI Intelligence Platform API',
    database: 'PostgreSQL + PostGIS',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Start Server and Initialize Database
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` SafeRoad AI Backend Server Running on Port ${PORT}`);
      console.log(` API Base URL: http://localhost:${PORT}/api`);
      console.log(` Database: PostgreSQL (${process.env.DB_NAME || 'saferoad_db'}) with PostGIS`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start SafeRoad backend server:', err);
    process.exit(1);
  }
}

startServer();
