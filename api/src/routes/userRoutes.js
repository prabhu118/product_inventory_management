import { Router } from 'express';
import UserController from '../controllers/userController';
import ValidateUser from '../middlewares/userValidator';
import ValidateRequest from '../middlewares/auth';
const router = Router();

router.post('/', ValidateUser, UserController.addUser);

router.post('/login', ValidateUser, UserController.login);

router.post('/cart', ValidateRequest, ValidateUser, UserController.addProductToCart);

router.delete('/cart/:productId', ValidateRequest, UserController.deleteProductFromCart);

export default router;