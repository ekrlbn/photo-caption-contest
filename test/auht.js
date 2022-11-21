/* globals describe,after it */

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User } = require('../models/models');
require('dotenv').config();

// const { expect } = chai;
chai.use(chaiHttp);
const app = require('../app');

// user
describe('Authentication Routes', () => {
	const username = crypto.randomBytes(10).toString('hex');
	const password = crypto.randomBytes(10).toString('hex');

	after(async () => {
		await User.destroy({
			where: {
				username,
			},
		});
	});
	describe('/user', () => {
		describe('POST', async () => {
			it('should send authentication token with header', (done) => {
				chai
					.request(app)
					.post('/api/user')
					.send({ username, password })
					.then(async (res) => {
						assert.equal(res.status, 201);
						const [, token] = res.headers.authorization.split(' ');
						const decoded = await jwt.verify(token, process.env.JWT_SECRET);
						assert.deepEqual(decoded.username, username);
						const isValid = await bcrypt.compare(password, decoded.password);
						assert.deepEqual(isValid, true);
						done();
					})
					.catch((err) => {
						done(err);
					});
			});
			it('should store it in the database', async () => {
				const user = await User.findOne({
					where: { username },
				});
				assert.notEqual(user, null);
			});
			it('should return 403 if user already exists', async () => {
				await chai
					.request(app)
					.post('/api/user')
					.send({ username, password })
					.then((res) => {
						assert.equal(res.status, 403);
						assert.equal(res.body.message, 'username is already taken');
					})
					.catch((err) => {
						throw err;
					});
			});
		});
	});

	describe('/token', () => {
		describe('POST', () => {
			it('should return token', async () => {
				await chai
					.request(app)
					.post('/api/token')
					.send({ username, password })
					.then(async (res) => {
						assert.equal(res.status, 200);
						const { token } = res.body;
						const decoded = await jwt.verify(token, process.env.JWT_SECRET);
						assert.equal(decoded.username, username);
						// expect(decoded.username).to.equal(username);
						const isValid = await bcrypt.compare(password, decoded.password);
						assert.equal(isValid, true);
					})
					.catch((err) => {
						throw err;
					});
			});

			it('should return 404', async () => {
				await chai
					.request(app)
					.post('/api/token')
					.send({ username: 'wrongUsername', password })
					.then((res) => {
						assert.equal(res.status, 404);
					});
			});

			it('should return 401', async () => {
				await chai
					.request(app)
					.post('/api/token')
					.send({ username, password: 'wrongPassword' })
					.then((res) => {
						assert.equal(res.status, 401);
					})
					.catch((err) => {
						throw err;
					});
			});
		});
	});
});
