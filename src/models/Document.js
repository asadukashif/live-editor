const { Schema, model } = require("mongoose");

const DocumentSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
});

module.exports = model("Document", DocumentSchema);
