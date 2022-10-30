require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./documentation.yml');

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const { authRouter } = require('./routers/auth');
const { imageRouter } = require('./routers/image');
const { captionRouter } = require('./routers/caption');

app.use(express.static('/uploads'));
app.use('/api', authRouter);
app.use('/api/images', imageRouter);
app.use('/api/captions', captionRouter);
app.get('/', (req, res) => {
	res.redirect('/api-docs');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});
