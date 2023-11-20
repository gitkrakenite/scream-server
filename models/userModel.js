const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    campusID: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    isPaid: { type: String, default: "nope", required: true },
    isAdmin: { type: String, default: "nope", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
