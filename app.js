require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

const { authRouter } = require('./routers/auth');
const { imageRouter } = require('./routers/image');
const { captionRouter } = require('./routers/caption');

app.use(express.static('/uploads'));
app.use('/api', authRouter);
app.use('/api/images', imageRouter);
app.use('/api/captions', captionRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});
