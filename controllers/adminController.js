const expressAsyncHandler = require("express-async-handler");
const Role = require("../models/permision");
const { errors } = require("../error");

const createWorker = expressAsyncHandler(async (req, res, next) => {
  const { name, email, password, roles } = req.body;

  const role = new Role({ role: "admin" });
  await role.save()

  res.status(200).json({
    statusCode: 200,
    message: "Worker created successfully!",
  });
});

module.exports = {
  createWorker,
};
