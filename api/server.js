import dotEnv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import http from 'http';
import passport from 'passport';
import logger from 'log4js';
import loggerConfig from './src/config/logger';
import router from './src/routes/indexRoutes';
// test
dotEnv.config();

const port = process.env.PORT || 8000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(passport.initialize());
logger.configure(loggerConfig);
app.use(logger.connectLogger(logger.getLogger('http'), { level: 'auto' }));

require('./src/middlewares/passport');

require('./src/config/dbConnection');

app.use(`${process.env.API_INITIALS}`, router);

const server = http.createServer(app);

app.on('ready', () => {
	server.listen(port, () => { console.log(`Server is running on port : ${port}`); });
});

app.on('close', () => {
	server.close(() => {
		console.log('Server connection is disconnected due to termination.');
		process.exit(0); 
	});
});

export default app;
