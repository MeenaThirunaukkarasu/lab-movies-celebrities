//  Add your code here
const mongoose = require("mongoose");

const celebritySchema = new mongoose.Schema({
  name: String,
  occupation: String,
  catchphrase: String,
});

const Celebrities = mongoose.model("Celebrities", celebritySchema);

module.exports = Celebrities;
