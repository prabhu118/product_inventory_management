import mongoose from 'mongoose';
import app from '../../server';

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
	app.emit('ready');
	console.log('Successfully connected to database..');
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
