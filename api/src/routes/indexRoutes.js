import { Router } from 'express';
import ProductRoutes from '../routes/productRoutes';
import UserRoutes from '../routes/userRoutes';
const router = Router();

router.get('/', (req, res) => {
	return res.status(200).json({ type: true });
});

router.use('/user', UserRoutes);

router.use('/product', ProductRoutes);

router.use('**', (req, res) => {
	return res.status(404).json({ success: false, message: 'Requested URL not found' });
});

export default router;