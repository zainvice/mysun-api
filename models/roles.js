const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
  role: { type: String },
});

module.exports = model("Role", roleSchema);
