import { Request, Response } from "express";
import Booking from "../models/Booking";

// POST /api/bookings
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hallId, purpose, date, startTime, endTime, attendees } = req.body;
    const user = req.user!;

    const conflict = await Booking.findOne({
      hallId,
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (conflict) {
      res.status(409).json({ message: "Time slot is already booked" });
      return;
    }

    const booking = new Booking({
      hallId,
      userId: user._id,
      userName: user.name,
      purpose,
      date,
      startTime,
      endTime,
      attendees,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({
      message: "Booking failed",
      error: (err as Error).message,
    });
  }
};

// GET /api/bookings/me
export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({ userId: req.user!._id });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: (err as Error).message,
    });
  }
};

// GET /api/bookings (admin only)
export const getAllBookings = async (_: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: (err as Error).message,
    });
  }
};

// PUT /api/bookings/:id/status
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, rejectionReason } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return;
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    booking.status = status;
    if (status === "rejected" && rejectionReason) {
      booking.rejectionReason = rejectionReason;
    }

    await booking.save();
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({
      message: "Status update failed",
      error: (err as Error).message,
    });
  }
};

// GET /api/bookings/availability?hallId=xxx&date=yyyy-mm-dd
export const getBookingAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hallId, date } = req.query;

    if (!hallId || !date) {
      res.status(400).json({ message: "hallId and date are required" });
      return;
    }

    const bookings = await Booking.find({ hallId, date });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch availability",
      error: (err as Error).message,
    });
  }
};
