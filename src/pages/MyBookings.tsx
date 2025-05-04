import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "@/api/axios";
import { toast } from "sonner";
import { IBooking, IHall } from "@/types";
import { getErrorMessage } from "@/utils/errorHandler";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [halls, setHalls] = useState<IHall[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, hallsRes] = await Promise.all([
          axios.get<IBooking[]>("/api/bookings/me"), // ← corrected endpoint
          axios.get<IHall[]>("/api/halls"),
        ]);
        setBookings(bookingRes.data);
        setHalls(hallsRes.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    };
    fetchData();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true;
    return b.status === activeTab;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getHallById = (id: string) => halls.find((h) => h._id === id);

  const handleCancelBooking = async (id: string) => {
    try {
      await axios.delete(`/api/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success("Booking cancelled successfully");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClass =
      "flex items-center gap-1 border rounded px-2 py-0.5 text-xs font-medium";
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <AlertTriangle size={12} />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle size={12} />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200"
          >
            <XCircle size={12} />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-academy-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-academy-text">
              My Bookings
            </h1>
            <p className="text-academy-muted">
              Manage your seminar hall booking requests
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <TabsList className="grid grid-cols-4 gap-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <TabsTrigger
                    key={status}
                    value={status}
                    className="flex justify-center"
                  >
                    <span className="capitalize hidden sm:inline">
                      {status}
                    </span>
                    <span className="sm:hidden">
                      {status.charAt(0).toUpperCase()}
                    </span>
                    <Badge className="ml-1.5">
                      {status === "all"
                        ? bookings.length
                        : bookings.filter((b) => b.status === status).length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-6">
              {filteredBookings.length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => {
                    const hall = getHallById(booking.hallId);
                    return (
                      <motion.div
                        key={booking._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-sm p-4 md:p-6"
                      >
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="text-lg font-semibold flex items-center">
                              {hall?.name || "Unknown Hall"}
                              <span className="ml-3">
                                {getStatusBadge(booking.status)}
                              </span>
                            </h3>
                            <p className="text-academy-muted mt-1">
                              {booking.purpose}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 mt-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-academy-blue" />
                                <span className="text-sm">
                                  {formatDate(booking.date)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-academy-blue" />
                                <span className="text-sm">
                                  {booking.startTime} - {booking.endTime}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 text-academy-blue" />
                                <span className="text-sm">
                                  {booking.attendees} attendees
                                </span>
                              </div>
                            </div>
                          </div>

                          {booking.status === "pending" && (
                            <div className="flex flex-col justify-center mt-4 md:mt-0 space-y-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-academy-danger border-academy-danger hover:bg-academy-danger/10"
                                onClick={() => handleCancelBooking(booking._id)}
                              >
                                Cancel Request
                              </Button>
                            </div>
                          )}
                        </div>

                        {booking.status === "rejected" &&
                          booking.rejectionReason && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
                              <p className="font-medium">Rejection Reason:</p>
                              <p>{booking.rejectionReason}</p>
                            </div>
                          )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="bg-academy-background rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-academy-muted" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No bookings found
                  </h3>
                  <p className="text-academy-muted mb-6">
                    You don’t have any{" "}
                    {activeTab !== "all" ? activeTab : ""} bookings yet.
                  </p>
                  <Button
                    className="bg-academy-blue hover:bg-academy-light-blue"
                    onClick={() => navigate("/book")}
                  >
                    Book a Hall
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default MyBookings;
