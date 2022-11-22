/* globals describe, after, it */

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, Image } = require('../models/models');

chai.use(chaiHttp);
const app = require('../app');

// captions
describe('/captions', async () => {
	const username = crypto.randomBytes(10).toString('hex');
	let password = crypto.randomBytes(10).toString('hex');

	password = await bcrypt.hash(password, 10);

	let user = await User.create({
		username,
		password,
	});

	user = user.dataValues;

	const auth = await jwt.sign(user, process.env.JWT_SECRET);

	const image = await Image.create({
		filename: 'test',
		user_id: user.id,
	});

	after(async () => {
		await Image.destroy({
			where: {
				user_id: user.id,
			},
		});

		await User.destroy({
			where: {
				username,
			},
		});
	});

	describe('GET', () => {
		it('should return 200', async () => {
			await chai
				.request(app)
				.get(`/api/captions/${image.id}`)
				.set('Authorization', `Bearer ${auth}`)
				.then((res) => {
					assert.equal(res.status, 200);
				})
				.catch((err) => {
					throw err;
				});
		});
		it('should return 401 if no token is provided', async () => {
			await chai
				.request(app)
				.get('/api/captions')
				.then((res) => {
					assert.equal(res.status, 401);
				})
				.catch((err) => {
					throw err;
				});
		});

		it('should return 404 if image does not exist', async () => {
			await chai
				.request(app)
				.get('/api/captions/0')
				.set('Authorization', `Bearer ${auth}`)
				.then((res) => {
					assert.equal(res.status, 404);
				})
				.catch((err) => {
					throw err;
				});
		});
	});

	describe('POST', () => {
		it('should return 201', async () => {
			await chai
				.request(app)
				.post(`/api/captions/${image.id}`)
				.set('Authorization', `Bearer ${auth}`)
				.send({
					caption: 'test',
				})
				.then((res) => {
					assert.equal(res.status, 201);
				})
				.catch((err) => {
					throw err;
				});
		});
		it('should return 401 if no token is provided', async () => {
			await chai
				.request(app)
				.post(`/api/captions/${image.id}`)
				.then((res) => {
					assert.equal(res.status, 401);
				})
				.catch((err) => {
					throw err;
				});
		});
		it('should return 403 if there is already a caption to an image', async () => {
			await chai
				.request(app)
				.post('/api/captions/0')
				.set('Authorization', `Bearer ${auth}`)
				.send({
					caption: 'test',
				})
				.then((res) => {
					assert.equal(res.status, 403);
				})
				.catch((err) => {
					throw err;
				});
		});
	});

	describe('DELETE', () => {
		it('should return 204', async () => {
			await chai
				.request(app)
				.delete(`/api/captions/${image.id}`)
				.set('Authorization', `Bearer ${auth}`)
				.then((res) => {
					assert.equal(res.status, 204);
				})
				.catch((err) => {
					throw err;
				});
		});
		it('should return 401 if no token is provided', async () => {
			await chai
				.request(app)
				.delete(`/api/captions/${image.id}`)
				.then((res) => {
					assert.equal(res.status, 401);
				})
				.catch((err) => {
					throw err;
				});
		});
		it('should return 404 if caption does not exist', async () => {
			await chai
				.request(app)
				.delete(`/api/captions/${image.id}`)
				.set('Authorization', `Bearer ${auth}`)
				.then((res) => {
					assert.equal(res.status, 404);
				})
				.catch((err) => {
					throw err;
				});
		});
		it('should return 404 if image does not exist', async () => {
			await chai
				.request(app)
				.delete('/api/captions/0')
				.set('Authorization', `Bearer ${auth}`)
				.then((res) => {
					assert.equal(res.status, 404);
				})
				.catch((err) => {
					throw err;
				});
		});
	});
});
