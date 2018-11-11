const path = require("path");
const bunyan = require("bunyan");

const level = process.env.NODE_LOGGING_LEVEL || "info";

const logger = bunyan.createLogger({
  name: "js-blockchain",
  streams: [
    {
      level,
      stream: process.stdout
    },
    {
      level,
      path: path.resolve(__dirname,"..", "logs/error.json")
    }
  ]
});

module.exports = logger;
