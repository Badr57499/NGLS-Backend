
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const connectDb = require('./Config/connect');
require('dotenv').config();
const { setServers } = require('node:dns/promises');
setServers(['1.1.1.1', '8.8.8.8']);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigin = 'https://ngls-front-pmuzgd1bf-badr16.vercel.app';
const corsOptions = {
    origin: allowedOrigin,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','Accept','Origin','X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use('/uploads', express.static('uploads'));
app.use('/api', require('./Routes/registerRoute'));
app.use('/api', require('./Routes/loginRoute'));
app.use('/api', require('./Routes/ancsRoute'));
app.use('/api', require('./Routes/videosRoute'));



async function StartServer() {
    try{
        await connectDb();
        app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        });
        
    }catch(error){
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

StartServer();
