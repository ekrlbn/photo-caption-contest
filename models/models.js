const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

let dialectOptions = {
	ssl: {
		require: true,
		rejectUnauthorized: false,
	},
};
if (process.env.NODE_ENV === 'development') {
	dialectOptions = {};
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	// eslint-disable-next-line object-shorthand
	dialectOptions: dialectOptions,
	dialect: 'postgres',
	logging: false,
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

User.hasMany(Caption, { foreignKey: 'user_id' });
Caption.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Image, { foreignKey: 'user_id' });
Image.belongsTo(User, { foreignKey: 'user_id' });

async function syncModels() {
	await User.sync();
	await Image.sync();
	await Caption.sync();
}
syncModels();
module.exports = {
	User,
	Image,
	Caption,
};
