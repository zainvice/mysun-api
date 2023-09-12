const { Schema, model } = require("mongoose");

const permissionSchema = new Schema({ permission: { type: String } });
module.exports = model('Permission', permissionSchema)