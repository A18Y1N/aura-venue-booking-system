import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import hallRoutes from './routes/hallRoutes';
import bookingRoutes from './routes/bookingRoutes'; // ✅ Import booking routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/bookings', bookingRoutes); // ✅ Register route here
app.use("/api/halls", hallRoutes);

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
