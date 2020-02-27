import { Router } from 'express';
import UserController from '../controllers/userController';
import ValidateUser from '../middlewares/userValidator';
import ValidateRequest from '../middlewares/auth';
const router = Router();

router.post('/', ValidateUser, UserController.addUser);

router.post('/login', ValidateUser, UserController.login);

router.put('/cart', ValidateRequest, ValidateUser, UserController.addProductToCart);

export default router;