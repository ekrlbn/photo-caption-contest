const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');

const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});
