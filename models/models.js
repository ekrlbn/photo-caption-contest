const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	// database: process.env.DB,
	// username: process.env.DB_USERNAME,
	// password: process.env.DB_PASSWORD,
	// host: process.env.DB_HOST,
	dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },

	dialect: 'postgres',
	query: { raw: false, benchmark: true },
});

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
});

// const Like = sequelize.define('Like', {
// 	user_id: {
// 		type: DataTypes.INTEGER,
// 		references: { model: 'Users', key: 'id' },
// 	},
// 	caption_id: {
// 		type: DataTypes.INTEGER,
// 		references: { model: 'Captions', key: 'id' },
// 		onDelete: 'CASCADE',
// 	},
// });

User.hasMany(Caption, { foreignKey: 'user_id' });
Caption.belongsTo(User, { foreignKey: 'user_id' });

async function syncModels() {
	await User.sync();
	await Image.sync();
	await Caption.sync();
	// await Like.sync();
}
syncModels();
module.exports = {
	User,
	Image,
	Caption,
};
