import express from 'express';
import { userRoutes } from './routes/userRoutes'; 

const app = express();

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the User Registration API!');
});

app.use('/api/users', userRoutes); 

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
