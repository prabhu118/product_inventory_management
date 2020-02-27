import Product from '../models/productModel';
import User from '../models/userModel';

class ProductController {

	static async getAllProducts(req, res) {
		try {
			var count = await Product.find({}).count().exec();
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
			console.log(err);
		}
	}

	static async addProduct(req, res) {
		try {
			const product = new Product(req.body);
			await product.save();
			return res.status(201).json({ success: true, product: product });
		} catch (err) {
			console.log(err);
		}
	}

	static async updateProduct(req, res) {
		try {
			const { id, productName, productPrice, stock } = req.body;
			if(!/^[0-9a-fA-F]{24}$/.test(id)) return res.status(422).json({success: false, message: 'Invalid product id'});
			const product = await Product.update({_id: id}, { $set: { productName: productName, productPrice: productPrice, stock: stock } }, { new: true }).exec();
			return res.status(200).json({ success: true, product: product });
		} catch (err) {
			console.log(err);
		}
	}

	static async deleteProduct(req, res) {
		try {
			if(!/^[0-9a-fA-F]{24}$/.test(req.params.id)) return res.status(422).json({success: false, message: 'Invalid product id'});
			await User.update({ $pull: { cart: { product: req.params.id } }});
			let result = await Product.find({ _id: req.params.id }).remove().exec();
			if (result.deletedCount > 0) {
				return res.status(200).json({ success: true });
			} else {
				return res.status(404).json({ success: false });
			}
		} catch (err) {
			console.log(err);
		}
	}

}

export default ProductController;