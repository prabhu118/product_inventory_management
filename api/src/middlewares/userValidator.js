import Joi from '@hapi/joi';

const addUserSchema = Joi.object().keys({
	name: Joi.string().trim().regex(/^[a-zA-Z ]{3,30}$/).required(),
	email: Joi.string().lowercase().email().required().error(() => 'Email is required'),
	phone: Joi.string().max(10).required(),
	password: Joi.string().trim().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).required().error(() => 'Password must be minimum eight characters long, at least one letter, one number and one special character.')
});

const loginSchema = Joi.object().keys({
	username: Joi.string().lowercase().email().required(),
	password: Joi.string().trim().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).required().error(() => 'Password must be minimum eight characters long, at least one letter, one number and one special character.')
});

const ValidateUser = (req, res, next) => {
	try {
		let schema;
		switch (req.originalUrl) {
		case '/user':
			if (req.method === 'POST') schema = addUserSchema;
			break;
		case '/user/login':
			schema = loginSchema;
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