const file = require("fs");
const morgan = require("morgan");
const path = require("path");

const logFileStream = file.createWriteStream('logs/app.log', { flags: "a" });
module.exports = morgan("common", {
  stream: logFileStream,
});
