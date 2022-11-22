/* globals describe,after, it */

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');

// eslint-disable-next-line object-curly-newline
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, Image } = require('../models/models');

chai.use(chaiHttp);
const app = require('../app');

// images
describe('/images', async () => {
	const username = crypto.randomBytes(10).toString('hex');
	let password = crypto.randomBytes(10).toString('hex');

	password = await bcrypt.hash(password, 10);

	let user = await User.create({
		username,
		password,
	});

	user = user.dataValues;

	const auth = await jwt.sign(user, process.env.JWT_SECRET);

	after(async () => {
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
				.get('/api/images')
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
				.get('/api/images')
				.then((res) => {
					assert.equal(res.status, 401);
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
				.post('/api/images')
				.set('Authorization', `Bearer ${auth}`)
				.attach('file', 'test/test.png')
				.then((res) => {
					assert.equal(res.status, 201);
				})
				.catch((err) => {
					throw err;
				});
		});
	});
	describe('GET', () => {
		it('should return 200', async () => {
			const image = await Image.findOne({ where: { user_id: user.id } });
			await chai
				.request(app)
				.get(`/api/images/${image.id}`)
				.set('Authorization', `Bearer ${auth}`)
				.then((res) => {
					assert.equal(res.status, 200);
					assert.equal(res.header['content-type'], 'image/png');
				})
				.catch((err) => {
					throw err;
				});
		});
		it('should return 404 if no image is found with the given id', async () => {
			await chai
				.request(app)
				.get('/api/images/0')
				.set('Authorization', `Bearer ${auth}`)
				.then((res) => {
					assert.equal(res.status, 404);
				})
				.catch((err) => {
					throw err;
				});
		});
	});

	describe('DELETE', () => {
		it('should return 204', async () => {
			const image = await Image.findOne({ where: { user_id: user.id } });
			await chai
				.request(app)
				.delete(`/api/images/${image.id}`)
				.set('Authorization', `Bearer ${auth}`)
				.then((res) => {
					assert.equal(res.status, 204);
				})
				.catch((err) => {
					throw err;
				});
		});
		it('should return 404 if no image is found with the given id', async () => {
			await chai
				.request(app)
				.delete('/api/images/0')
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
