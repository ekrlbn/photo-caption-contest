const captionRouter = require('express').Router();
const { Caption, User } = require('../models/models');

captionRouter.get('/:imageID', async (req, res) => {
	try {
		const { imageID } = req.params;
		let captions = await Caption.findAll({
			where: { image_id: imageID },
			include: { model: User },
		});
		if (captions.length === 0) return res.send(captions);
		captions = captions.map((o) => ({
			caption: o.caption,
			username: o.User.username,
			like: o.like,
		}));
		return res.json(captions);
	} catch (error) {
		return res.sendStatus(500);
	}
});

captionRouter.post('/', async (req, res) => {
	try {
		const userID = req.user.id;
		const { imageID, caption } = req.body;
		const foundCaption = await Caption.findOne({
			where: { user_id: userID, image_id: imageID },
		});
		if (!foundCaption) {
			await Caption.create({ user_id: userID, image_id: imageID, caption });
			return res.sendStatus(201);
		}
		return res.sendStatus(403);
	} catch (error) {
		return res.sendStatus(500);
	}
});

// captionRouter.put('/:id', async (req, res) => {
// 	try {
// 		const userID = req.user.id;
// 		const foundCaption = await Caption.findByPk(req.params.id);
// 		if (!foundCaption) return res.sendStatus(404);
// 		const foundLike = await Like.findOne({
// 			where: { user_id: userID, caption_id: foundCaption.id },
// 		});
// 		if (foundLike) {
// 			await Like.destroy({
// 				where: { user_id: userID, caption_id: foundCaption.id },
// 			});
// 			await Caption.update(
// 				{ like: foundCaption.like - 1 },
// 				{ where: { id: foundCaption.id } },
// 			);
// 			return res.sendStatus(204);
// 		}
// 		await Like.create({ user_id: userID, caption_id: foundCaption.id });
// 		await Caption.update(
// 			{ like: foundCaption.like + 1 },
// 			{ where: { id: foundCaption.id } },
// 		);
// 		return res.sendStatus(204);
// 	} catch (error) {
// 		return res.sendStatus(500);
// 	}
// });

captionRouter.delete('/:id', async (req, res) => {
	try {
		const userID = req.user.id;
		const foundCaption = await Caption.findOne({
			where: { id: req.params.id, user_id: userID },
		});
		if (!foundCaption) return res.sendStatus(404);
		await Caption.destroy({ where: { id: req.params.id, user_id: userID } });
		return res.sendStatus(204);
	} catch (error) {
		return res.sendStatus(500);
	}
});
module.exports = { captionRouter };
