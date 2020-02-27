import mongoose, { Schema } from 'mongoose';

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

const User = mongoose.model('User', UserSchema);

export default User;