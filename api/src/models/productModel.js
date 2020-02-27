import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema ({

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
		min: 0,
		required: true
	}

}, {
	timestamps: true
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;