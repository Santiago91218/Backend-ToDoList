require("dotenv").config();
const { get } = require("env-var");

const envs = {
  port: get("PORT").required().asPortNumber(),
  bdurl: get("MONGO_BD").required().asString(),
};

module.exports = { envs };
