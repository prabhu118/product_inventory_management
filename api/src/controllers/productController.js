import Product from '../models/productModel';

class ProductController {

	static async getAllProducts(req, res) {
		try {
			var count = await Product.find({}).count().exec();
			var perPage = 10;
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
			const product = await Product.findByIdAndUpdate(id, { $set: { productName: productName, productPrice: productPrice, stock: stock } }, { new: true }).exec();
			return res.status(200).json({ success: true, product: product });
		} catch (err) {
			console.log(err);
		}
	}

	static async deleteProduct(req, res) {
		try {
			console.log(req.body);
			// Product.findByIdAndDelete().exec();
		} catch (err) {
			console.log(err);
		}
	}

}

export default ProductController;