import { HallBlock } from './enums';

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface SeminarHall {
  id: string;
  name: string;
  block: HallBlock;
  capacity: number;
  features: string[];
  image: string;
  description: string;
  availableTimeSlots?: TimeSlot[];
}

export interface IHall {
  _id: string;
  id: string;
  name: string;
  block: HallBlock;
  description: string;
}
