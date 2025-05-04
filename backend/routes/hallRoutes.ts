import express from "express";
import {
  createHall,
  getAllHalls,
  getHallById,
  updateHall,
  deleteHall,
} from "../controllers/hallController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

// POST /api/halls (admin only)
router.post("/", protect, adminOnly, createHall);

// GET /api/halls (any authenticated user)
router.get("/", protect, getAllHalls);

// GET /api/halls/:id (any authenticated user)
router.get("/:id", protect, getHallById);

// PUT /api/halls/:id (admin only)
router.put("/:id", protect, adminOnly, updateHall);

// DELETE /api/halls/:id (admin only)
router.delete("/:id", protect, adminOnly, deleteHall);

export default router;
