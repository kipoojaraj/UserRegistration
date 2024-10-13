import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { userRoutes } from './routes/userRoutes';
import logger from './utils/logger';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); 
app.use('/api/users', userRoutes); 

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || '', { })
    .then(() => {
        app.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => logger.error('MongoDB connection error:', err));
