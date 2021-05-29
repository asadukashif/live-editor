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
  data: {
    type: Object
  }
});

module.exports = model("Document", DocumentSchema);