import { Router } from 'express';
import ProductController from '../controllers/productController';
import ValidateProduct from '../middlewares/productValidator';
import ValidateRequest from '../middlewares/auth';
const router = Router();

router.get('/', ProductController.getAllProducts);

router.post('/', ValidateRequest, ValidateProduct, ProductController.addProduct);

router.put('/:id', ValidateRequest, ValidateProduct, ProductController.updateProduct);

router.delete('/:id', ValidateRequest, ProductController.deleteProduct);

export default router;