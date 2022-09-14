const authRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isLength, isEmpty } = require('validator').default;
const { User } = require('../models/models');

authRouter.post('/user', async (req, res) => {
	try {
		const { password, username } = req.body;
		if (isEmpty(username, { ignore_whitespace: true })) {
			return res.json({ message: 'username not found' });
		}
		if (!isLength(password, { min: 8 })) {
			return res.json({ message: 'password must be at least 8 characters' });
		}
		const hashedPass = await bcrypt.hash(password, 10);
		let user = await User.create({
			username: username.trim(),
			password: hashedPass,
		});
		user = user.dataValues;
		if (!user) throw new Error('internal server error');
		const token = await jwt.sign(user, process.env.JWT_SECRET);
		res.setHeader('Authorization', `Bearer ${token}`);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
	return res.status(201).json({ message: 'user created' });
});

authRouter.use(async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		if (!authorization) throw new Error('token not found');
		const token = req.headers.authorization.split(' ')[1];
		const user = await jwt.verify(token, process.env.JWT_SECRET);

		const foundUser = await User.findOne({
			where: { username: user.username, password: user.password },
		});
		if (!foundUser) return res.sendStatus(401);
		req.user = foundUser;
		return next();
	} catch (error) {
		return res.status(401).json({ message: error.message });
	}
});
module.exports = { authRouter };
