const {DataTypes} = require("sequelize");
const sequelize = require("../server.js");

const File = sequelize.define("File", {
    filename : DataTypes.STRING,
    path : DataTypes.STRING
});

module.exports = File