const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const message = sequelize.define('message_', {
    id:{type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    version_:{type: DataTypes.STRING},
    signature_:{type: DataTypes.STRING},
    severity:{type: DataTypes.INTEGER},
    extensionId: {type: DataTypes.INTEGER},
    deviceId: {type: DataTypes.INTEGER},
    time: {type: DataTypes.STRING}
}, {
    timestamps: false
})

module.exports = message;

