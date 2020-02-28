import mongoose from 'mongoose';
import app from '../../server';
import User from '../models/userModel';

mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
	app.emit('ready');
	console.log('Successfully connected to database..');
	mongoose.connection.db.listCollections({name: 'users'})
		.next((err, collinfo) => {
			try {
				if (collinfo) {
					User.findOne({email: 'admin@admin.com'}).then(async res => {
						if(!res) {
							const user = new User({
								name: 'Admin',
								email: 'admin@admin.com',
								password: 'admin@123',
								phone: '8097312287',
								userType: 1
							});
							await user.save();
						}
					});
				}
			} catch(err) {
				console.log(err);
			}
		});
});

mongoose.connection.on('disconnected', () => {
	console.log('Database connection disconnected..');
});

mongoose.connection.on('error', () => {
	console.log('Error while connecting to database..');
	process.exit(1);
});

process.on('SIGINT', function () {
	mongoose.connection.close(() => {
		console.log('Mongoose default connection is disconnected due to application termination');
		app.emit('close');
	});
});
