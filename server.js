const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const app = express();
const path = require('path');


dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes

 app.use('/api/user', userRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

//handle static file 
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static('public'));


const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
