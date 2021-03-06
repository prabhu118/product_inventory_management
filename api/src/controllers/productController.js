import Product from '../models/productModel';
import User from '../models/userModel';
import { getLogger } from 'log4js';

const logger = getLogger('PRODUCT');

class ProductController {

	/**
	 * @method getAllProducts - Returns list of products (pagination implemented)
	 * @param {perPage, page} req - Takes 2 query params
	 * @param {success, products, count, totalPages, perPage} res
	 */
	static async getAllProducts(req, res) {
		try {
			var count = await Product.find({}).countDocuments().exec();
			var perPage = req.query.perPage || 10;
			var page = req.query.page || 1;
			var pages = count / perPage;
			var total = Math.ceil(pages);

			const products = await Product.find({})
				.skip((perPage * page) - perPage)
				.limit(perPage)
				.sort({ createdAt: -1 })
				.exec();
			return res.json({ success: true, products: products, count: count, totalPages: total, perPage: perPage });
		} catch (err) {
			logger.error({methodName: 'getAllProducts', payload: req.query, error: err});
			return res.status(500).json({success:false, message: 'Something went wrong'});
		}
	}

	/**
	 * @method addProduct - Adds new product 
	 * @param {*} req - Takes product data required to add new product
	 * @param {success, product} res
	 */
	static async addProduct(req, res) {
		try {
			const product = new Product(req.body);
			await product.save();
			return res.status(201).json({ success: true, product: product });
		} catch (err) {
			logger.error({methodName: 'addProduct', payload: req.body, user: req.user, error: err});
			return res.status(500).json({success:false, message: 'Something went wrong'});
		}
	}

	/**
	 * @method updateProduct - Updates products details
	 * @param {*} req - Takes required product data
	 * @param {success, product} res 
	 */
	static async updateProduct(req, res) {
		try {
			// const { productName, productPrice, stock } = req.body;
			if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) return res.status(422).json({ success: false, message: 'Invalid product id' });
			await Product.update({ _id: req.params.id }, { $set: req.body}).exec();
			return res.status(200).json({ success: true, message: 'Product updated' });
		} catch (err) {
			logger.error({methodName: 'updateProduct', payload: req.body, user: req.user, error: err});
			return res.status(500).json({success:false, message: 'Something went wrong'});
		}
	}

	/**
	 * @method deleteProduct - Removes product from the product collection including the cart
	 * @param {*} req 
	 * @param {success} res 
	 */
	static async deleteProduct(req, res) {
		try {
			if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) return res.status(422).json({ success: false, message: 'Invalid product id' });
			await User.update({ $pull: { cart: { product: req.params.id } } });
			let result = await Product.find({ _id: req.params.id }).remove().exec();
			if (result.deletedCount > 0) {
				return res.status(200).json({ success: true });
			} else {
				return res.status(404).json({ success: false });
			}
		} catch (err) {
			logger.error({methodName: 'deleteProduct', payload: req.params, user: req.user, error: err});
			return res.status(500).json({success:false, message: 'Something went wrong'});
		}
	}

}

export default ProductController;