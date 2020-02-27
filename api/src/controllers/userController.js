import User from '../models/userModel';
import passport from 'passport';
import jwt from 'jsonwebtoken';

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

				let data = { email: user.email, userType: user.userType, id: user._id };
				let token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '10h' });
				return res.status(200).json({ token: token });

			})(req, res, next);
		} catch (err) {
			console.log(err);
		}
	}
}

export default UserController;