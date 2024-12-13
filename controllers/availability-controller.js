const availabilityModel = require("../models/availability-model");
const { getRole } = require("../utils/validateRole");

const convertToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const normalizeTimeFormat = (time) => {
  const [hours, minutes] = time.split(":");
  const normalizedHours = String(hours).padStart(2, "0");
  const normalizedMinutes = String(minutes).padStart(2, "0");
  return `${normalizedHours}:${normalizedMinutes}`;
};

const addSlots = async (req, res) => {
  try {
    const userId = req.userId;
    const role = getRole(userId);

    if (role === "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { slots } = req.body;

    const formattedSlots = slots.split(",").map((slot) => {
      const [startTime, endTime] = slot.split("-");

      const normalizedStartTime = normalizeTimeFormat(startTime);
      const normalizedEndTime = normalizeTimeFormat(endTime);

      return {
        startTime: normalizedStartTime,
        endTime: normalizedEndTime,
        isBooked: false,
      };
    });

    const availability = await availabilityModel.create({
      professor: userId,
      slots: formattedSlots,
    });

    res
      .status(200)
      .json({ message: "Availability added", success: true, availability });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const checkProfessorAvailability = async (req, res) => {
  try {
    const userId = req.userId;
    const role = getRole(userId);

    if (role === "professor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const professorId = req.params.professor;
    if (!professorId) {
      return res
        .status(404)
        .json({ message: "Professor ID is required", success: false });
    }

    const professorAvailability = await availabilityModel.findOne({
      professor: professorId,
    });
    if (!professorAvailability) {
      return res
        .status(404)
        .json({ message: "Professor not found", success: false });
    }

    const { slot } = req.body;
    const [startTime, endTime] = slot.split("-").map(convertToMinutes);

    const isAvailable = professorAvailability.slots.some(
      (s) => !s.isBooked && s.startTime <= startTime && s.endTime >= endTime
    );

    if (!isAvailable) {
      return res.status(400).json({
        message: "No available slot or already booked",
        success: false,
      });
    }

    res.status(200).json({ message: "Slot is available", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = { addSlots, checkProfessorAvailability };
