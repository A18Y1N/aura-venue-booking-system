
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { seminarHalls, mockBookings } from "@/data/hallsData";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Clock, Users, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const MyBookings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  const userBookings = mockBookings.filter(booking => booking.userId === user.id);
  
  const pendingBookings = userBookings.filter(booking => booking.status === "pending");
  const approvedBookings = userBookings.filter(booking => booking.status === "approved");
  const rejectedBookings = userBookings.filter(booking => booking.status === "rejected");
  
  const getDisplayedBookings = () => {
    switch (activeTab) {
      case "pending":
        return pendingBookings;
      case "approved":
        return approvedBookings;
      case "rejected":
        return rejectedBookings;
      default:
        return userBookings;
    }
  };
  
  const displayedBookings = getDisplayedBookings();
  
  const handleCancelBooking = (bookingId: string) => {
    toast.success("Booking cancelled successfully!");
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const getHallById = (hallId: string) => {
    return seminarHalls.find(hall => hall.id === hallId);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle size={12} />
            <span>Pending</span>
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
            <CheckCircle size={12} />
            <span>Approved</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
            <XCircle size={12} />
            <span>Rejected</span>
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
            <h1 className="text-3xl font-bold text-academy-text">My Bookings</h1>
            <p className="text-academy-muted">Manage your seminar hall booking requests</p>
          </div>
          
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="bg-white rounded-lg shadow-sm p-4">
              <TabsList className="grid grid-cols-4 gap-2">
                <TabsTrigger value="all" className="flex justify-center">
                  <span className="hidden sm:inline">All Bookings</span>
                  <span className="sm:hidden">All</span>
                  <Badge className="ml-1.5 bg-academy-muted/20 text-academy-muted hover:bg-academy-muted/20">{userBookings.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex justify-center">
                  <span className="hidden sm:inline">Pending</span>
                  <span className="sm:hidden">Pending</span>
                  <Badge className="ml-1.5 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{pendingBookings.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex justify-center">
                  <span className="hidden sm:inline">Approved</span>
                  <span className="sm:hidden">Approved</span>
                  <Badge className="ml-1.5 bg-green-100 text-green-800 hover:bg-green-100">{approvedBookings.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex justify-center">
                  <span className="hidden sm:inline">Rejected</span>
                  <span className="sm:hidden">Rejected</span>
                  <Badge className="ml-1.5 bg-red-100 text-red-800 hover:bg-red-100">{rejectedBookings.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="mt-6">
              {displayedBookings.length > 0 ? (
                <div className="space-y-4">
                  {displayedBookings.map((booking) => {
                    const hall = getHallById(booking.hallId);
                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-sm p-4 md:p-6"
                      >
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-semibold flex items-center">
                              {hall?.name}
                              <span className="ml-3">{getStatusBadge(booking.status)}</span>
                            </h3>
                            <p className="text-academy-muted mt-1">{booking.purpose}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 mt-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-academy-blue" />
                                <span className="text-sm">{formatDate(booking.date)}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-academy-blue" />
                                <span className="text-sm">{booking.startTime} - {booking.endTime}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 text-academy-blue" />
                                <span className="text-sm">{booking.attendees} attendees</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-center space-y-2">
                            {booking.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-academy-danger border-academy-danger hover:bg-academy-danger/10"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel Request
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {booking.status === "rejected" && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
                            <p className="font-medium">Rejection Reason:</p>
                            <p>The hall is not available for the requested time slot. Please try a different date or time.</p>
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
                  <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
                  <p className="text-academy-muted mb-6">You don't have any {activeTab !== "all" ? activeTab : ""} bookings yet.</p>
                  <Button className="bg-academy-blue hover:bg-academy-light-blue">
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
