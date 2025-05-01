
import { useState } from "react";
import { motion } from "framer-motion";
import AdminNavbar from "@/components/AdminNavbar";
import { seminarHalls, mockBookings } from "@/data/hallsData";
import { Calendar, Clock, Users, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  if (!user?.isAdmin) {
    navigate("/login");
    return null;
  }
  
  const pendingBookings = mockBookings.filter(booking => booking.status === "pending");
  const approvedBookings = mockBookings.filter(booking => booking.status === "approved");
  const rejectedBookings = mockBookings.filter(booking => booking.status === "rejected");
  
  const getDisplayedBookings = () => {
    let filtered = [];
    
    switch (activeTab) {
      case "pending":
        filtered = pendingBookings;
        break;
      case "approved":
        filtered = approvedBookings;
        break;
      case "rejected":
        filtered = rejectedBookings;
        break;
      default:
        filtered = mockBookings;
    }
    
    if (searchTerm) {
      filtered = filtered.filter(booking => {
        const hall = seminarHalls.find(h => h.id === booking.hallId);
        return (
          hall?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.purpose.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    return filtered;
  };
  
  const displayedBookings = getDisplayedBookings();
  
  const handleApprove = (bookingId: string) => {
    toast.success("Booking request approved successfully!");
  };
  
  const handleReject = () => {
    if (!selectedBookingId) return;
    
    toast.success("Booking request rejected successfully!");
    setRejectionReason("");
    setSelectedBookingId(null);
  };
  
  const handleOpenRejectDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId);
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

  return (
    <div className="min-h-screen bg-academy-background">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-academy-text">Booking Requests</h1>
              <p className="text-academy-muted">Manage and process hall booking requests</p>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search by hall name, user or purpose..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                
                <Tabs
                  defaultValue="pending"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="flex-shrink-0 w-full md:w-auto"
                >
                  <TabsList className="grid grid-cols-3 w-full md:w-[340px]">
                    <TabsTrigger value="pending" className="flex gap-2 items-center">
                      <span>Pending</span>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        {pendingBookings.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="flex gap-2 items-center">
                      <span>Approved</span>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {approvedBookings.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="flex gap-2 items-center">
                      <span>Rejected</span>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        {rejectedBookings.length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
          
          <TabsContent value={activeTab} className="mt-0">
            {displayedBookings.length > 0 ? (
              <div className="space-y-4">
                {displayedBookings.map((booking) => {
                  const hall = getHallById(booking.hallId);
                  return (
                    <Card key={booking.id}>
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <CardTitle>{hall?.name}</CardTitle>
                          {booking.status === "pending" && (
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              <Button
                                size="sm"
                                className="bg-academy-success hover:bg-academy-success/90 text-white"
                                onClick={() => handleApprove(booking.id)}
                              >
                                Approve
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-academy-danger text-academy-danger hover:bg-academy-danger/10"
                                    onClick={() => handleOpenRejectDialog(booking.id)}
                                  >
                                    Reject
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Reject Booking Request</DialogTitle>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <p className="text-academy-muted mb-4">
                                      Please provide a reason for rejecting this booking request.
                                    </p>
                                    <Textarea
                                      placeholder="Enter reason for rejection"
                                      value={rejectionReason}
                                      onChange={(e) => setRejectionReason(e.target.value)}
                                      className="min-h-[100px]"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button 
                                      className="bg-academy-danger hover:bg-academy-danger/90"
                                      onClick={handleReject}
                                      disabled={!rejectionReason.trim()}
                                    >
                                      Confirm Rejection
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center mb-2">
                              <Users className="h-5 w-5 mr-2 text-academy-blue" />
                              <h4 className="font-medium">Requester: {booking.userName}</h4>
                            </div>
                            <p className="text-academy-muted mb-4">{booking.purpose}</p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                          
                          <div className="bg-academy-background rounded-md p-4">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                              Request Information
                            </h4>
                            <div className="text-sm space-y-1">
                              <p><span className="font-medium">Hall Capacity:</span> {hall?.capacity} persons</p>
                              <p><span className="font-medium">Request Date:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
                              <p><span className="font-medium">Occupancy Rate:</span> {Math.round((booking.attendees / (hall?.capacity || 1)) * 100)}%</p>
                              <p>
                                <span className="font-medium">Status:</span>{" "}
                                <span className={`
                                  ${booking.status === "pending" ? "text-yellow-600" : ""} 
                                  ${booking.status === "approved" ? "text-green-600" : ""} 
                                  ${booking.status === "rejected" ? "text-red-600" : ""}
                                  font-medium
                                `}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="bg-academy-background rounded-full h-16 w-16 flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-academy-muted" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No requests found</h3>
                  <p className="text-academy-muted">No {activeTab} booking requests available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminRequests;
