const mongoose = require("mongoose");

// Define user schema
const userDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const userDetails = mongoose.model("detailsusers", userDetailsSchema);

module.exports = userDetails;
