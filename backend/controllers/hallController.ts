import { Request, Response } from "express";
import Hall from "../models/Hall";

// POST /api/halls
export const createHall = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, location, capacity } = req.body;

    const existing = await Hall.findOne({ name });
    if (existing) {
      res.status(400).json({ message: "Hall already exists" });
      return;
    }

    const hall = new Hall({ name, location, capacity });
    await hall.save();

    res.status(201).json(hall);
  } catch (err) {
    res.status(500).json({ message: "Failed to create hall", error: (err as Error).message });
  }
};

// GET /api/halls
export const getAllHalls = async (_: Request, res: Response): Promise<void> => {
  try {
    const halls = await Hall.find();
    res.status(200).json(halls);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch halls", error: (err as Error).message });
  }
};

// GET /api/halls/:id
export const getHallById = async (req: Request, res: Response): Promise<void> => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) {
      res.status(404).json({ message: "Hall not found" });
      return;
    }
    res.status(200).json(hall);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hall", error: (err as Error).message });
  }
};

// PUT /api/halls/:id
export const updateHall = async (req: Request, res: Response): Promise<void> => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) {
      res.status(404).json({ message: "Hall not found" });
      return;
    }

    const { name, location, capacity } = req.body;
    hall.name = name ?? hall.name;
    hall.location = location ?? hall.location;
    hall.capacity = capacity ?? hall.capacity;

    await hall.save();
    res.status(200).json(hall);
  } catch (err) {
    res.status(500).json({ message: "Failed to update hall", error: (err as Error).message });
  }
};

// DELETE /api/halls/:id
export const deleteHall = async (req: Request, res: Response): Promise<void> => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) {
      res.status(404).json({ message: "Hall not found" });
      return;
    }

    await hall.deleteOne();
    res.status(200).json({ message: "Hall deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete hall", error: (err as Error).message });
  }
};
