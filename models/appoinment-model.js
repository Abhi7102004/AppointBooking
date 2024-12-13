const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
  },
});

module.exports =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);
