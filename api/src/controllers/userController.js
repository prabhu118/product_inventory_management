import User from '../models/userModel';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import Product from '../models/productModel';

class UserController {

	static async addUser(req, res) {
		try {
			const user = new User(req.body);
			await user.save();
			return res.status(201).json({ success: true });
		} catch (err) {
			if (err.name === 'MongoError' && err.code === 11000) {
				return res.status(422).json({ success: false, message: err.message });
			}
		}
	}

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

	static async addProductToCart(req, res) {
		try {
			console.log(req.body);
			const product = await Product.findById(req.body.product).exec();
			if (!product) return res.status(422).json({ success: false, message: 'Invalid Product' });
			if (product.stock > req.body.qty) {
				await User.update({ _id: req.user.id }, { $push: { cart: req.body } }).exec();
				await Product.update({ _id: req.body.product }, { $inc: { stock: -1 } }).exec();
				return res.status(200).json({ success: true, message: 'Product added to cart' });
			} else {
				return res.status(404).json({ success: false, message: 'Product out of stock' });
			}

		} catch (err) {
			console.log(err);
		}
	}
}

export default UserController;