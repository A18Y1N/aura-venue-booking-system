import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import { IBooking, IHall } from "@/types";
import { BookingStatus } from "@/types/enums";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import "@/styles/AdminBookings.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [halls, setHalls] = useState<IHall[]>([]);
  const [selectedTab, setSelectedTab] = useState<BookingStatus | "all">("all");
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});

  const fetchData = async () => {
    try {
      const bookingRes = await axios.get<{ bookings: IBooking[] }>("/api/bookings");
      const hallRes = await axios.get<{ halls: IHall[] }>("/api/halls");
      setBookings(bookingRes.data.bookings);
      setHalls(hallRes.data.halls);
    } catch (err) {
      toast.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: string, status: BookingStatus, reason?: string) => {
    try {
      await axios.put(`/api/bookings/${id}/status`, { status, reason });
      toast.success("Status updated");
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredBookings =
    selectedTab === "all"
      ? bookings
      : bookings.filter((b) => b.status === selectedTab);

  return (
    <div className="admin-bookings-container">
      <h2>Manage Bookings</h2>
      <div className="tabs">
        <button onClick={() => setSelectedTab("all")}>All</button>
        <button onClick={() => setSelectedTab(BookingStatus.Pending)}>Pending</button>
        <button onClick={() => setSelectedTab(BookingStatus.Approved)}>Approved</button>
        <button onClick={() => setSelectedTab(BookingStatus.Rejected)}>Rejected</button>
      </div>

      <div className="bookings-list">
        {filteredBookings.map((b) => {
          const hall = halls.find((h) => h._id === b.hallId);
          return (
            <div className="booking-card" key={b._id}>
              <h4>{b.title || "Booking Request"}</h4>
              <p>Hall: {hall?.name || "Unknown"}</p>
              <p>Date: {new Date(b.date).toLocaleDateString()}</p>
              <p>Time: {b.startTime} - {b.endTime}</p>
              <p>Status: {b.status}</p>
              {b.status === BookingStatus.Pending && (
                <div className="admin-actions">
                  <button onClick={() => updateStatus(b._id, BookingStatus.Approved)}>
                    Approve
                  </button>
                  <textarea
                    placeholder="Rejection reason"
                    value={rejectReasons[b._id] || ""}
                    onChange={(e) =>
                      setRejectReasons((prev) => ({ ...prev, [b._id]: e.target.value }))
                    }
                  />
                  <button
                    onClick={() =>
                      updateStatus(b._id, BookingStatus.Rejected, rejectReasons[b._id])
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBookings;
