import mongoose, { Schema } from 'mongoose';
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({

	name: {
		type: String,
		required: true
	},

	email: {
		type: String,
		required: true,
		unique: true
	},

	phone: {
		type: String,
		required: true
	},

	password : {
		type: String,
		required: true
	},

	cart: [{
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product'
		},
		qty: {
			type: Number
		}
	}]

}, {
	timestamps: true
});

UserSchema.pre('save', function (next) {
	let user = this;
	user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
	next();
});

UserSchema.method('validatePassword', function (password) {
	return bcrypt.compareSync(password, this.password);
});

const User = mongoose.model('User', UserSchema);

export default User;