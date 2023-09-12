const generateError = (status, message) => {
  return {
    status, message
  }
}

module.exports = {
  validationError: (message = "Incomplete fields!") => {
    return generateError(422, message)
  },

  notfoundError: (message = "Not found!") => {
    return generateError(404, message);
  },

  forbiddenError: (message = "Forbidden!") => {
    return generateError(403, message);
  },

  unauthorizedError: (message= "Unauthorized!") => {
    return generateError(401, message)
  },

  serverError: (message = "Server Error!") => {
    return generateError(500, message);
  }
};
