import Joi from '@hapi/joi';

const addProductSchema = Joi.object().keys({
	productName: Joi.string().trim().required(),
	productPrice: Joi.number().min(1).required(),
	stock: Joi.number().min(1).required()
});

const ValidateProduct = (req, res, next) => {
	try {
		let schema;
		switch (req.method) {
		case 'POST':
			schema = addProductSchema;
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

export default ValidateProduct;