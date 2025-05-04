import { BookingStatus } from './enums';

export interface IBooking {
  _id: string;
  title?: string; // Optional, shown in AdminBookings
  hallId: string;
  userId: string;
  userName: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: BookingStatus;
  rejectionReason?: string;
  createdAt: string;
  hall?: {
    name: string;
    _id: string;
  };
}
