module.exports = (err, req, res, next) => {
  return res.status(err.statusCode ?? 500).send({
    statusCode: err.statusCode,
    message: err.message ?? "Something went wrong!"
  });
};
