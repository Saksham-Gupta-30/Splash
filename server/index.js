import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import deepaiRoutes from './routes/deepaiRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/deepai', deepaiRoutes);

app.get('/', (req, res) => {
    res.send('Hello from server!');
});

const startServer = async () => {

    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

startServer();