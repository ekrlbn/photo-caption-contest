const imageRouter = require('express').Router();
const path = require('path');
const multer = require('multer');
const { Image } = require('../models/models');

const upload = multer({ dest: 'uploads' });

imageRouter.post('/', upload.single('file'), async (req, res) => {
	try {
		const extension = req.file.mimetype.split('/')[1];
		const { filename } = req.file;
		await Image.create({ user_id: req.user.id, extension, filename });
		res.sendStatus('201');
	} catch (error) {
		res.send(500, error.message);
	}
});

imageRouter.get('/:id', async (req, res) => {
	try {
		const foundImage = await Image.findByPk(req.params.id);
		if (!foundImage) return res.sendStatus(404);
		res.setHeader('Content-Type', 'image/png');
		return res.download(
			path.join(process.cwd(), `\\uploads\\${foundImage.filename}`),
		);
	} catch (error) {
		return res.send(500, error.message);
	}
});

module.exports = { imageRouter };
