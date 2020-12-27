const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
let users = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});
users.plugin(mongoosePaginate);

const User = mongoose.model("User", users);

// const User = mongoose.model("User", users);

module.exports = User;
