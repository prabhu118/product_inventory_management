import User from '../models/userModel';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import Product from '../models/productModel';

class UserController {

	/**
	 * @method addUser - Adds new user to the collection
	 * @param {*} req - Takes necessary data required to add a user
	 * @param {success, user} res 
	 */
	static async addUser(req, res) {
		try {
			const user = new User(req.body);
			await user.save();
			return res.status(201).json({ success: true, user: user });
		} catch (err) {
			if (err.name === 'MongoError' && err.code === 11000) {
				return res.status(422).json({ success: false, message: err.message });
			}
		}
	}

	/**
	 * @method login - Authenticates user & returns token
	 * @param {username, password} req - 
	 * @param {success, token} res 
	 * @param {*} next 
	 */
	static async login(req, res, next) {
		try {
			passport.authenticate('local.signin', { session: false }, function (err, user, info) {
				if (err) return res.status(400).json({ type: false, message: err });
				if (info) return res.status(400).json({ type: false, message: info.message });

				let data = { email: user.email, userType: user.userType || null, id: user._id };
				let token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '10h' });
				return res.status(200).json({ success: true, token: token });
			})(req, res, next);
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * @method addProductToCart - Add/update product in cart 
	 * @param {*} req - Takes required data 
	 * @param {success, message} res 
	 */
	static async addProductToCart(req, res) {
		try {
			const product = await Product.findById(req.body.product).exec();
			if (!product) return res.status(422).json({ success: false, message: 'Product does not exists' });
			if (product.stock == 0) return res.status(404).json({ success: false, message: 'Product out of stock' });

			let qty;
			if (product.stock > req.body.qty) {
				qty = req.body.qty;
			} else {
				qty = req.body.qty = req.body.qty - (req.body.qty - product.stock);
			}

			let productExists = await User.findOne({ _id: req.user.id, cart: { $elemMatch: { product: req.body.product } } }).exec();
			if (productExists) {
				await User.updateOne({_id: req.user.id, 'cart.product': req.body.product}, { $set: { 'cart.$.product': qty } }).exec();
			} else {
				await User.update({ _id: req.user.id }, { $push: { cart: req.body } }).exec();
			}
			await Product.update({ _id: req.body.product }, { $inc: { stock: -qty } }).exec();
			return res.status(200).json({ success: true, message: `Product added to cart with quntity ${qty}` });
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * @method deleteProductFromCart - Removes product from cart & product collection
	 * @param {*} req - Takes required data
	 * @param {success, message} res 
	 */
	static async deleteProductFromCart(req, res) {
		try {
			if (!/^[0-9a-fA-F]{24}$/.test(req.params.productId)) return res.status(422).json({ success: false, message: 'Invalid product id' });

			let user = await User.findOne({ _id: req.user.id, cart: { $elemMatch: { product: req.params.productId } } }).exec();
			if (user) {
				let qty = user.cart[0].qty;
				user = await User.update({ _id: req.user.id }, { $pull: { cart: { product: req.params.productId } } });
				if (user.nModified > 0) {
					await Product.update({ _id: req.params.productId }, { $inc: { stock: qty } }).exec();
					return res.status(200).json({ success: true, message: 'Product removed form the cart' });
				}
			} else {
				return res.status(404).json({ success: false, message: 'Product does not exists in cart' });
			}
		} catch (err) {
			console.log(err);
		}
	}
}

export default UserController;