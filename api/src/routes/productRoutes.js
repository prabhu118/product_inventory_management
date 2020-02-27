import { Router } from 'express';
import ProductController from '../controllers/productController';
import ValidateProduct from '../middlewares/productValidator';
const router = Router();

router.post('/', ValidateProduct, ProductController.addProduct);
router.put('/', ValidateProduct, ProductController.updateProduct);
router.delete('/', ValidateProduct, ProductController.deleteProduct);

export default router;