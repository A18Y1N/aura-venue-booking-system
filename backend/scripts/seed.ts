import mongoose from "mongoose";
import dotenv from "dotenv";
import Hall from "../models/Hall";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

const seedHalls = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Hall.deleteMany();

    await Hall.insertMany([
      {
        id: "lhc1",
        name: "LHC Seminar Hall I",
        block: "LHC Block",
        description: "Large seminar hall on the LHC first floor",
      },
      {
        id: "lhc2",
        name: "LHC Seminar Hall II",
        block: "LHC Block",
        description: "Second seminar hall in the LHC Block",
      },
      {
        id: "des1",
        name: "DES Seminar Hall I",
        block: "DES Block",
        description: "Seminar hall in DES Block, ground floor",
      },
      {
        id: "des2",
        name: "DES Seminar Hall II",
        block: "DES Block",
        description: "Medium-size seminar hall on the DES second floor",
      },
      {
        id: "esb1",
        name: "ESB Seminar Hall I",
        block: "ESB Block",
        description: "Electronic Systems Block Seminar Hall I",
      },
      {
        id: "esb2",
        name: "ESB Seminar Hall II",
        block: "ESB Block",
        description: "Electronic Systems Block Seminar Hall II",
      },
      {
        id: "apex",
        name: "APEX Auditorium",
        block: "Main Block",
        description: "Auditorium for larger events and gatherings",
      },
    ]);

    console.log("✅ All halls seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedHalls();
