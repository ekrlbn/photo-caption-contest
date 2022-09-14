const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/models');

const authRouter = express.Router();
authRouter.post('/user', async (req, res) => {
	try {
		const { password, username } = req.body;
		if (!username) return res.json({ message: 'username not found' });
		if (!password) return res.json({ message: 'password not found' });
		const hashedPass = await bcrypt.hash(password, 10);
		let user = await User.create({ username, password: hashedPass });
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
