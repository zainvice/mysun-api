const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: { type: String, required },
    email: { type: String, required },
    password: { type: String, required },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role", required }],
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
