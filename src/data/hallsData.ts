
import { SeminarHall } from "@/types";

export const seminarHalls: SeminarHall[] = [
  {
    id: "lhc-1",
    name: "LHC Seminar Hall - 1",
    block: "LHC",
    capacity: 180,
    features: [
      "HD Projector",
      "Professional Sound System",
      "Wireless Microphones (4)",
      "Air Conditioning",
      "Ergonomic Seating",
      "High-Speed WiFi"
    ],
    image: "/placeholder.svg",
    description: "A modern seminar hall located in the Learning Hub Complex (LHC) block. Perfect for academic presentations, guest lectures, and medium-sized events."
  },
  {
    id: "lhc-2",
    name: "LHC Seminar Hall - 2",
    block: "LHC",
    capacity: 150,
    features: [
      "4K Projector",
      "Surround Sound System",
      "Wireless Microphones (3)",
      "Air Conditioning",
      "Flexible Seating Arrangement",
      "High-Speed WiFi",
      "Digital Podium"
    ],
    image: "/placeholder.svg",
    description: "The second seminar hall in the Learning Hub Complex (LHC) features state-of-the-art facilities for seminars, workshops, and academic events."
  },
  {
    id: "esb-1",
    name: "ESB Seminar Hall - 1",
    block: "ESB",
    capacity: 200,
    features: [
      "Dual Projection System",
      "Premium Audio Equipment",
      "Wireless Microphones (5)",
      "Air Conditioning",
      "Tiered Seating",
      "High-Speed WiFi",
      "Recording Facilities"
    ],
    image: "/placeholder.svg",
    description: "Located in the Engineering Sciences Block (ESB), this hall offers superior acoustics and visibility, ideal for technical presentations and conferences."
  },
  {
    id: "esb-2",
    name: "ESB Seminar Hall - 2",
    block: "ESB",
    capacity: 180,
    features: [
      "HD Projector",
      "Digital Sound System",
      "Wireless Microphones (4)",
      "Air Conditioning",
      "Comfortable Seating",
      "High-Speed WiFi",
      "Interactive Whiteboard"
    ],
    image: "/placeholder.svg",
    description: "The second hall in the Engineering Sciences Block (ESB) features interactive technology suitable for collaborative sessions and technical demonstrations."
  },
  {
    id: "des-1",
    name: "DES Seminar Hall - 1",
    block: "DES",
    capacity: 150,
    features: [
      "4K Projector",
      "Sound System",
      "Wireless Microphones (3)",
      "Air Conditioning",
      "Modular Seating",
      "High-Speed WiFi",
      "Smart Lighting"
    ],
    image: "/placeholder.svg",
    description: "Situated in the Design Studies (DES) block, this hall offers a creative environment with excellent audiovisual capabilities for design-oriented presentations."
  },
  {
    id: "des-2",
    name: "DES Seminar Hall - 2",
    block: "DES",
    capacity: 160,
    features: [
      "HD Projector",
      "Surround Sound",
      "Wireless Microphones (4)",
      "Air Conditioning",
      "Designer Seating",
      "High-Speed WiFi",
      "Digital Display Boards"
    ],
    image: "/placeholder.svg",
    description: "The second hall in the Design Studies (DES) block offers a modern aesthetic with technology focused on design showcases and creative presentations."
  },
  {
    id: "apex-1",
    name: "APEX Auditorium",
    block: "APEX",
    capacity: 1000,
    features: [
      "Dual 4K Projection System",
      "Professional Theater Sound System",
      "Wireless & Lapel Microphones (10)",
      "Climate Control System",
      "Premium Theater Seating",
      "High-Speed WiFi",
      "Professional Lighting Rig",
      "Green Room",
      "Backstage Facilities",
      "Live Streaming Equipment"
    ],
    image: "/placeholder.svg",
    description: "The flagship venue of the campus, APEX Auditorium offers professional-grade facilities for large conferences, cultural events, and prestigious gatherings with a capacity of 1000 attendees."
  }
];

export const mockBookings = [
  {
    id: "booking-1",
    hallId: "lhc-1",
    userId: "2",
    userName: "Regular User",
    purpose: "Department Meeting",
    date: "2025-05-15",
    startTime: "10:00",
    endTime: "12:00",
    attendees: 45,
    status: "pending",
    createdAt: "2025-05-01T10:30:00Z"
  },
  {
    id: "booking-2",
    hallId: "esb-2",
    userId: "2",
    userName: "Regular User",
    purpose: "Guest Lecture",
    date: "2025-05-18",
    startTime: "14:00",
    endTime: "16:00",
    attendees: 120,
    status: "approved",
    createdAt: "2025-04-28T09:15:00Z"
  },
  {
    id: "booking-3",
    hallId: "apex-1",
    userId: "2",
    userName: "Regular User",
    purpose: "Annual Symposium",
    date: "2025-06-05",
    startTime: "09:00",
    endTime: "17:00",
    attendees: 850,
    status: "pending",
    createdAt: "2025-04-25T11:45:00Z"
  }
];

// Function to get available time slots for 7 days starting from today
export const getAvailableTimeSlots = (hallId: string) => {
  const timeSlots = [];
  const today = new Date();
  
  // Generate time slots for 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    // Generate time slots for the day (9 AM to 6 PM, 1-hour slots)
    for (let hour = 9; hour < 18; hour++) {
      const startTime = `${hour < 10 ? '0' + hour : hour}:00`;
      const endTime = `${(hour + 1) < 10 ? '0' + (hour + 1) : (hour + 1)}:00`;
      
      // Check if this slot is already booked
      const isBooked = mockBookings.some(booking => 
        booking.hallId === hallId && 
        booking.date === dateString && 
        booking.startTime === startTime
      );
      
      timeSlots.push({
        id: `${hallId}-${dateString}-${startTime}`,
        date: dateString,
        startTime: startTime,
        endTime: endTime,
        isAvailable: !isBooked
      });
    }
  }
  
  return timeSlots;
};
