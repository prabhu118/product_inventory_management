import { Router } from 'express';
import UserController from '../controllers/userController';
import ValidateUser from '../middlewares/userValidator';
const router = Router();

router.post('/', ValidateUser, UserController.addUser);

router.post('/login', ValidateUser, UserController.login);

export default router;