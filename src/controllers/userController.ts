import { Request, Response, RequestHandler } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

// Register User
export const registerUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { username, password, age, gender, address } = req.body;

    if (!username || !password || age === undefined || !gender || !address) {
         res.status(400).json({ message: 'Please provide all required fields.' });
    } 
    else
    {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword, age, gender, address });
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            logger.error('User registration failed:', error);
            res.status(500).json({ message: 'User registration failed', error });
        }
    }

};

// Login User
export const loginUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        res.status(200).json({ token , message: 'Login Successfull'});
    } catch (error) {
        logger.error('Login failed:', error);
        res.status(500).json({ message: 'Login failed', error });
    }
};

// Get All Users with Pagination, Search, Sort, and Filter by Gender
export const getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    
    const { page = 1, limit = 10, search, gender, sort = 'username', order = 'asc' } = req.query;

    // Convert `page` and `limit` to numbers
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber; 

    
    let query: any = {};
    if (search) {
        query.username = { $regex: search, $options: 'i' }; 
    }
    if (gender) {
        query.gender = gender; // Filter by gender
    }

    try {
        
        const users = await User.find(query, { password: 0 }) 
            .skip(skip)
            .limit(limitNumber);

        
        const totalUsers = await User.countDocuments(query);

        
        res.status(200).json({
            message: 'Users fetched successfully',
            data: users,
            pagination: {
                total: totalUsers,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalUsers / limitNumber),
            },
        });
    } catch (error) {
        logger.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
};


// Get User by ID
export const getUserById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'user fetched sucessfully', data : user});
    } catch (error) {
        logger.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

// Delete User
export const deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

// Update User
export const updateUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; 
    const { username, age, gender, address } = req.body; 

    try {
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, age, gender, address }, 
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
             res.status(404).json({ message: 'User not found' });
        }
        else{
            res.status(200).json({ message: 'User updated successfully', data: updatedUser });

        }

    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
};