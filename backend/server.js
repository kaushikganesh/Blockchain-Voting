const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blockchain-voting', {
  // options are deprecated in latest mongoose but leaving clean connection
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/elections', require('./src/routes/elections'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/blockchain', require('./src/routes/blockchain'));

app.get('/', (req, res) => {
  res.send('Blockchain Voting System API Prototype is running.');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
