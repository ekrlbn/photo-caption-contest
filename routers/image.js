const imageRouter = require('express').Router();
// const path = require('path');
const fs = require('fs').promises;
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
		res.setHeader('Content-Type', `image/${foundImage.extension}`);
		const filePath = `./uploads/${foundImage.filename}`;
		await fs.access(filePath);
		return res.download(filePath);
	} catch (error) {
		if (error.errno === -4058) return res.sendStatus(404);
		return res.sendStatus(500);
	}
});

imageRouter.delete('/:id', async (req, res) => {
	try {
		const { user } = req;
		const foundImage = await Image.findOne({
			where: { id: req.params.id, user_id: user.id },
		});
		if (!foundImage) return res.sendStatus(404);
		const filePath = `./uploads/${foundImage.filename}`;
		await fs.access(filePath);
		await fs.rm(filePath);
		await Image.destroy({ where: { id: req.params.id, user_id: user.id } });
		return res.sendStatus(204);
	} catch (error) {
		if (error.errno === -4058) return res.sendStatus(404);
		return res.sendStatus(500);
	}
});

module.exports = { imageRouter };
