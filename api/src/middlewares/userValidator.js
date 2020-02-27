import Joi from '@hapi/joi';

const addUserSchema = Joi.object().keys({
	name: Joi.string().trim().regex(/^[a-zA-Z ]{3,30}$/).required(),
	email: Joi.string().lowercase().email().required(),
	phone: Joi.string().max(10).required(),
	password: Joi.string().trim().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).required().error(() => 'Password must be minimum eight characters long, at least one letter, one number and one special character.')
});

const loginSchema = Joi.object().keys({
	username: Joi.string().lowercase().email().required(),
	password: Joi.string().trim().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).required().error(() => 'Password must be minimum eight characters long, at least one letter, one number and one special character.')
});

const addToCartSchema = Joi.object().keys({
	id: Joi.string().required(),
	qty: Joi.number().min(1).required()
});

const ValidateUser = (req, res, next) => {
	try {
		let schema;
		switch (req.method) {
		case 'POST':
		case 'PUT':
			schema = (req.originalUrl === '/user/login') ? loginSchema : (req.originalUrl === '/user/cart') ? addToCartSchema : addUserSchema;
			break;
		default:
			break;
		}

		if (!schema) next();

		Joi.validate(req.body, schema, { abortEarly: true }, (err, data) => {
			if (err) {
				return res.status(422).json({ message: err.details[0].message });
			} else {
				next();
			}
		});
	} catch (err) {
		console.log(err);
	}
};

export default ValidateUser;