const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  documents: [
    {
      type: String,
      ref: "Document",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("User", UserSchema);
