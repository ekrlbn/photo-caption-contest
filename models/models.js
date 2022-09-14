const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
	process.env.DB,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{
		host: 'localhost',
		dialect: 'postgres',
		query: { raw: true, benchmark: true },
	},
);

const User = sequelize.define('User', {
	id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	username: { type: DataTypes.STRING, allowNull: false },
	password: { type: DataTypes.STRING, allowNull: false },
});
User.sync({ force: true });

module.exports = { User };
