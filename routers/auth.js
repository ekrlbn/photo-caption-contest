const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isLength, isEmpty } = require('validator').default;
const { User } = require('../models/models');

const authRouter = express.Router();
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
	return res.json({ message: 'user created' });
});

module.exports = { authRouter };
