require('dotenv').config();
const express = require('express');
const cors = require('cors');

const corsOptions = require('./src/config/cors');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/authRoutes');
const setupRoutes = require('./src/routes/setupRoutes');
const scoreRoutes = require('./src/routes/scoreRoutes');
const userRoutes = require('./src/routes/userRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const savingsRoutes = require('./src/routes/savingsRoutes');
const escrowRoutes = require('./src/routes/escrowRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,accountId');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(cors(corsOptions));

// Webhook routes need raw body for signature verification, so they
// are mounted BEFORE express.json() and handle their own body parsing.
app.use('/api/webhooks', webhookRoutes);

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: true, message: 'AjoBI backend is running', data: null });
});

app.use('/api/auth', authRoutes);
app.use('/api/ajoscore', scoreRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/user', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

app.use((req, res) => {
  res.status(404).json({ status: false, message: 'Route not found', data: null });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AjoBI backend running on port ${PORT}`);
});

require('./src/jobs/groupCollectionJob');
require('./src/jobs/savingsInstalmentJob');