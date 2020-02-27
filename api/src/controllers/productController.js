import Product from '../models/productModel';

class ProductController {

	static async addProduct(req, res) {
		try {
			const product = new Product(req.body);
			await product.save();
			return res.status(201).json({ success: true, product: product });
		} catch (err) {
			console.log(err);
		}
	}
	
}

export default ProductController;