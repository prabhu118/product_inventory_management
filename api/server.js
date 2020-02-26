import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
const port = process.env.port || 8000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res) => {
	return res.status(200).json({ type: true });
});

app.listen(port, () => console.log(`Server listening at port ${port}`));

