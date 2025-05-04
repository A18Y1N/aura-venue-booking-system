import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  getBookingAvailability,
} from "../controllers/bookingController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

// POST /api/bookings - Authenticated user can create booking
router.post("/", protect, createBooking);

// GET /api/bookings/me - Authenticated user sees their bookings
router.get("/me", protect, getUserBookings);

// GET /api/bookings - Admin only
router.get("/", protect, adminOnly, getAllBookings);

// PUT /api/bookings/:id/status - Admin changes status (approve/reject)
router.put("/:id/status", protect, adminOnly, updateBookingStatus);

// GET /api/bookings/availability - Any logged in user can check
router.get("/availability", protect, getBookingAvailability);

export default router;
