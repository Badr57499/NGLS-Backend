require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDb = require('./Config/connect');

const app = express();


// Allow all origins explicitly for CORS
// Ensure CORS headers are set as early as possible to cover errors and preflight
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    // short-circuit OPTIONS preflight
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// 1. Enable CORS globally (handles both standard requests and preflight OPTIONS automatically)
app.use(cors());
app.options('*', cors());

// 2. Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Database Connection Middleware (MUST BE BEFORE ROUTES)
app.use(async (req, res, next) => {
    try {
        await connectDb();
        next();
    } catch (error) {
        console.error('Database Connection Error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// 4. Routes
app.use('/uploads', express.static('uploads'));
app.use('/api', require('./Routes/registerRoute'));
app.use('/api', require('./Routes/loginRoute'));
app.use('/api', require('./Routes/ancsRoute'));
app.use('/api', require('./Routes/videosRoute'));

// 5. Local development execution
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running locally on port ${port}`);
    });
}

module.exports = app;
