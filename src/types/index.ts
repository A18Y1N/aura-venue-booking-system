export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'faculty' | 'admin';
}

export interface SeminarHall {
  id: string;
  name: string;
  block: 'LHC' | 'ESB' | 'DES' | 'APEX';
  capacity: number;
  features: string[];
  image: string;
  description: string;
  availableTimeSlots?: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  hallId: string;
  userId: string;
  userName: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected';
