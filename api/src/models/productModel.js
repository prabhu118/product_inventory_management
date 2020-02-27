import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema ({

	productId: {
		type: String,
		unique: true
	},

	productName: {
		type: String,
		required: true
	},

	productPrice: {
		type: String,
		required: true
	},
    
	stock: {
		type: Number,
		required: true
	}

}, {
	timestamps: true
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;