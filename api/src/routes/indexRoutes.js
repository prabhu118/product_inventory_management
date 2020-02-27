import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
	return res.status(200).json({ type: true });
});

router.use('**', (req,res) => {
	return res.status(404).json({success:false, message: 'Requested URL not found'});
});

export default router;