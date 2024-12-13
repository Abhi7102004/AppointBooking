const express = require("express");
const router = express.Router();

const availabilityModel = require("../models/availability-model");
const appointmentModel = require("../models/appoinment-model");
const { getRole } = require("../utils/validateRole");

const bookSlot = async (req, res) => {
  try {
    const userId = req.userId;
    const role = await getRole(userId);

    if (role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { professorId, slot } = req.body;

    if (!professorId || !slot) {
      return res
        .status(400)
        .json({ message: "Professor ID and slot are required" });
    }

    const [startTime, endTime] = slot.split("-");
    if (!startTime || !endTime || startTime >= endTime) {
      return res.status(400).json({ message: "Invalid slot format" });
    }

    const professorAvailability = await availabilityModel.findOne({
      professor: professorId,
    });

    if (!professorAvailability || !professorAvailability.slots.length) {
      return res
        .status(404)
        .json({ message: "No available slots for this professor" });
    }

    const availableSlot = professorAvailability.slots.find(
      (s) => !s.isBooked && s.startTime <= startTime && s.endTime >= endTime
    );

    if (!availableSlot) {
      return res.status(400).json({ message: "Slot is not available" });
    }

    // Create a pending appointment without marking the slot as booked
    const appointment = await appointmentModel.create({
      professor: professorId,
      student: userId,
      slot,
      status: "pending",
    });

    res
      .status(200)
      .json({
        message: "Slot request sent to professor",
        success: true,
        appointment,
      });
  } catch (error) {
    console.error("Error booking slot:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const pendingRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const role = await getRole(userId);

    if (role !== "professor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const requests = await appointmentModel
      .find({
        professor: userId,
        status: "pending",
      })
      .populate("student", "name email");

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const activeRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const role = await getRole(userId);

    if (role === "professor") {
      const requests = await appointmentModel
        .find({
          professor: userId,
          status: { $in: ["accepted", "pending"] },
        })
        .populate("student", "name email");

      return res.status(200).json({ success: true, requests });
    }

    if (role === "student") {
      const requests = await appointmentModel
        .find({
          student: userId,
          status: { $in: ["accepted", "pending"] },
        })
        .populate("professor", "name email");

      return res.status(200).json({ success: true, requests });
    }

    res.status(403).json({ message: "Access denied" });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const respondToStudentRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const role = await getRole(userId);

    if (role !== "professor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { requestId } = req.params;
    const { response } = req.body;

    if (!["accepted", "rejected"].includes(response)) {
      return res.status(400).json({ message: "Invalid response" });
    }

    const appointment = await appointmentModel.findOne({
      _id: requestId,
      professor: userId,
    });
    if (!appointment) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (response === "accepted") {
      const professorAvailability = await availabilityModel.findOne({
        professor: userId,
      });

      const bookedSlot = professorAvailability.slots.find(
        (s) =>
          s.startTime === appointment.slot.split("-")[0] &&
          s.endTime === appointment.slot.split("-")[1]
      );

      if (bookedSlot) {
        bookedSlot.isBooked = true;
        await professorAvailability.save();
      }
    }

    appointment.status = response;
    await appointment.save();

    res.status(200).json({ message: `Request ${response}`, success: true });
  } catch (error) {
    console.error("Error responding to request:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const cancelSlot = async (req, res) => {
  try {
    const userId = req.userId;
    const role = await getRole(userId);

    if (role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { slotId } = req.params;

    const appointment = await appointmentModel.findOne({
      _id: slotId,
      student: userId,
    });
    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Slot not found or not booked by you" });
    }

    const professorAvailability = await availabilityModel.findOne({
      professor: appointment.professor,
    });
    if (!professorAvailability) {
      return res
        .status(404)
        .json({ message: "Professor's availability not found" });
    }

    const bookedSlot = professorAvailability.slots.find(
      (s) =>
        s.startTime === appointment.slot.split("-")[0] &&
        s.endTime === appointment.slot.split("-")[1]
    );

    if (bookedSlot) {
      bookedSlot.isBooked = false;
    }

    await professorAvailability.save();
    await appointmentModel.deleteOne({ _id: slotId });

    res
      .status(200)
      .json({ message: "Slot canceled successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  bookSlot,
  pendingRequests,
  activeRequests,
  respondToStudentRequest,
  cancelSlot,
};
