const { Sequelize } = require("sequelize");

module.exports = new Sequelize("cef", "artemacuev", "go2579752", {
    host: "localhost",
    port: "5432",
    dialect: "postgres",
});