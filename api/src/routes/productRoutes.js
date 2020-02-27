import { Router } from 'express';
import ProductController from '../controllers/productController';
import ValidateProduct from '../middlewares/productValidator';
const router = Router();

router.get('/', ProductController.getAllProducts);
router.post('/', ValidateProduct, ProductController.addProduct);
router.put('/:id', ValidateProduct, ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export default router;