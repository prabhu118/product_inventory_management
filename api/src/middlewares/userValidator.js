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
	product: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(() => 'Invalid Product Id.'),
	qty: Joi.number().min(1).required()
});

const ValidateUser = (req, res, next) => {
	try {
		let schema;
		switch (req.originalUrl) {
		case `${process.env.API_INITIALS}/user`:
			schema = addUserSchema;
			break;
				
		case `${process.env.API_INITIALS}/user/cart`:
			schema = addToCartSchema;
			break;

		case `${process.env.API_INITIALS}/user/login`:
			schema = loginSchema;
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