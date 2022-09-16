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

const Image = sequelize.define('Image', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	filename: { type: DataTypes.STRING },
	user_id: {
		type: DataTypes.INTEGER,
		references: { model: 'Users', key: 'id' },
	},
	extension: { type: DataTypes.STRING },
	citation: { type: DataTypes.STRING },
});

const Caption = sequelize.define('Caption', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	user_id: {
		type: DataTypes.INTEGER,
		references: { model: 'Users', key: 'id' },
	},
	image_id: {
		type: DataTypes.INTEGER,
		references: { model: 'Images', key: 'id' },
		onDelete: 'CASCADE',
	},
	caption: { type: DataTypes.STRING },
	like: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
});

const Like = sequelize.define('Like', {
	user_id: {
		type: DataTypes.INTEGER,
		references: { model: 'Users', key: 'id' },
	},
	caption_id: {
		type: DataTypes.INTEGER,
		references: { model: 'Captions', key: 'id' },
		onDelete: 'CASCADE',
	},
});

// async function syncModels() {
// 	await User.sync({ force: true });
// 	await Image.sync({ force: true });
// 	await Caption.sync({ force: true });
// 	await Like.sync({ force: true });
// }
// syncModels();
module.exports = {
	User,
	Image,
	Caption,
	Like,
};
