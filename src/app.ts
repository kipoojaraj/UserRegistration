import express from 'express';
import { userRoutes } from './routes/userRoutes'; // Adjust the path as needed

const app = express();

// Middleware
app.use(express.json());

// Add a simple root route
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the User Registration API!');
});

// Use the user routes
app.use('/api/users', userRoutes); // Ensure your routes have a prefix

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
