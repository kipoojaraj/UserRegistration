import { Router, RequestHandler } from 'express';
import {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,
} from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// Cast each function to RequestHandler
router.post('/register', registerUser as RequestHandler); 
router.post('/login', loginUser as RequestHandler);
router.get('/',authMiddleware as RequestHandler, getAllUsers);
router.get('/:id',authMiddleware as RequestHandler, getUserById);
router.delete('/:id',authMiddleware as RequestHandler, deleteUser);
router.put('/:id', authMiddleware as RequestHandler, updateUser );


export { router as userRoutes };
