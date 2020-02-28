import Jwt from 'jsonwebtoken';

/**
 * @method ValidateRequest - Validates JWT token
 * @param {token} req  
 * @param {*} next - Pass data to next middleware
 */
const ValidateRequest = async (req, res, next) => {
	try {
		if(!req.headers.token) return res.status(401).json({success:false, message: 'Auth token is required'});

		Jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, valid) => {
			if (err) {
				return res.status(401).json({ message: 'Unauthorized access' });
			} else {
				req.user = valid;
				next();
			}
		});
	} catch (err) {
		console.log(err);
	}
};

export default ValidateRequest;