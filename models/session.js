const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Session", sessionSchema);
