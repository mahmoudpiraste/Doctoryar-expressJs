const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8005;

// app.use(express.json());


// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const patientFileRoutes = require('./routes/patientFiles');
const patientRecordRoutes = require('./routes/patientRecords');



app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', patientRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', patientFileRoutes);
app.use('/api', patientRecordRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
