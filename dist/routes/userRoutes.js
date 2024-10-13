"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
exports.userRoutes = router;
// Cast each function to RequestHandler
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.get('/', userController_1.getAllUsers);
router.get('/:id', userController_1.getUserById);
router.delete('/:id', userController_1.deleteUser);
