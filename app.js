require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const { authRouter } = require('./routers/auth');

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/', authRouter);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});
