const mongoose = require("mongoose");

const availabilitySchema = mongoose.Schema({
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  slots: [
    {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      isBooked: { type: Boolean, default: false },
    },
  ],
});
module.exports =
  mongoose.models.availability ||
  mongoose.model("availability", availabilitySchema);
