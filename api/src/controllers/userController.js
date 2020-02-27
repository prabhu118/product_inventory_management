import User from '../models/userModel';

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

	static async login(req, res) {
		try {
			console.log();
		} catch (err) {
			console.log(err);
		}
	}
}

export default UserController;