const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const extension = sequelize.define('extension', {
    id:{type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    dmac:{type: DataTypes.STRING},
    sPT:{type: DataTypes.STRING},
    request_URL:{type: DataTypes.STRING},
    file_path:{type: DataTypes.STRING},
    end_:{type: DataTypes.STRING},
    msg_:{type: DataTypes.STRING},
    type_:{type: DataTypes.STRING},
    Device_version:{type: DataTypes.STRING},
}, {
    timestamps: false
})

module.exports = extension;
