import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { IHall, IBooking } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "../utils/errorHandler";

const BookHall = () => {
  const { user } = useAuth();
  const [halls, setHalls] = useState<IHall[]>([]);
  const [selectedHall, setSelectedHall] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [attendees, setAttendees] = useState(1);
  const [existingBookings, setExistingBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await axios.get<IHall[]>("/api/halls");
        setHalls(res.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    };
    fetchHalls();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedHall || !date) return;
      try {
        const res = await axios.get<IBooking[]>(
          `/api/bookings/availability?hallId=${selectedHall}&date=${date}`
        );
        setExistingBookings(res.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    };
    fetchAvailability();
  }, [selectedHall, date]);

  const isTimeSlotAvailable = () => {
    return !existingBookings.some((booking) => {
      return startTime < booking.endTime && endTime > booking.startTime;
    });
  };

  const handleBooking = async () => {
    if (!selectedHall || !date || !startTime || !endTime || !purpose || !attendees) {
      toast.error("Please fill in all fields");
      return;
    }

    if (startTime >= endTime) {
      toast.error("Start time must be before end time");
      return;
    }

    if (!isTimeSlotAvailable()) {
      toast.error("This time slot is already booked");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<{ message: string }>("/api/bookings", {
        hallId: selectedHall,
        userId: user?._id, // ✅ Optional: if backend doesn't extract from token
        date,
        startTime,
        endTime,
        purpose,
        attendees,
      });
      toast.success(res.data.message);

      // Reset form
      setSelectedHall("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setPurpose("");
      setAttendees(1);
      setExistingBookings([]);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Book a Seminar Hall</h2>

      <div>
        <Label>Select Hall</Label>
        <Select value={selectedHall} onValueChange={setSelectedHall}>
          {halls.map((hall) => (
            <SelectItem key={hall._id} value={hall._id}>
              {hall.name} ({hall.block})
            </SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <Label>Date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {existingBookings.length > 0 && (
        <div className="text-sm text-red-600">
          <p className="font-semibold">Unavailable Time Slots:</p>
          <ul className="list-disc list-inside">
            {existingBookings.map((booking, idx) => (
              <li key={idx}>
                {booking.startTime} - {booking.endTime}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <Label>Start Time</Label>
        <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>

      <div>
        <Label>End Time</Label>
        <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </div>

      <div>
        <Label>Purpose</Label>
        <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} />
      </div>

      <div>
        <Label>Number of Attendees</Label>
        <Input
          type="number"
          value={attendees}
          min={1}
          onChange={(e) => setAttendees(parseInt(e.target.value))}
        />
      </div>

      <Button onClick={handleBooking} disabled={loading}>
        {loading ? "Submitting..." : "Submit Booking"}
      </Button>
    </div>
  );
};

export default BookHall;
