import User from '../models/userModel';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import Product from '../models/productModel';
import { getLogger } from 'log4js';

const logger = getLogger('USER');

class UserController {

	/**
	 * @method getAllUsers - To fetch all the users
	 * @param {*} req 
	 * @param {success, users, count, totalPages, perPage} res 
	 */
	static async getAllUsers(req, res) {
		try {
			var count = await User.find({}).countDocuments().exec();
			var perPage = req.query.perPage || 10;
			var page = req.query.page || 1;
			var pages = count / perPage;
			var total = Math.ceil(pages);

			const users = await User.find({})
				.populate({
					path: 'cart.product',
					model: 'Product',
					select: '-createdAt -updatedAt'
				})
				.skip((perPage * page) - perPage)
				.limit(perPage)
				.sort({ createdAt: -1 })
				.exec();
			return res.json({ success: true, users: users, count: count, totalPages: total, perPage: perPage });
		} catch(err) {
			logger.error({methodName: 'getAllUsers', payload: req.query, error: err});
			return res.status(500).json({success:false, message: 'Something went wrong'});
		}
	}

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
			logger.error({methodName: 'addUser', payload: req.body, error: err});
			if (err.name === 'MongoError' && err.code === 11000) {
				return res.status(422).json({ success: false, message: err.message });
			} else {
				return res.status(500).json({success:false, message: 'Something went wrong'});
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
				console.log(user);
				let data = { email: user.email, userType: user.userType || 0, id: user._id };
				let token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '10h' });
				return res.status(200).json({ success: true, token: token });
			})(req, res, next);
		} catch (err) {
			logger.error({methodName: 'login', payload: req.body, error: err});
			return res.status(500).json({success:false, message: 'Something went wrong'});
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
			logger.error({methodName: 'addProductToCart', payload: req.body, user: req.user, error: err});
			return res.status(500).json({success:false, message: 'Something went wrong'});
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
			logger.error({methodName: 'deleteProductFromCart', payload: req.params, user: req.user, error: err});
			return res.status(500).json({success:false, message: 'Something went wrong'});
		}
	}
}

export default UserController;