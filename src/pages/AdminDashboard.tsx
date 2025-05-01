
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Building, AlertTriangle, Users, Calendar } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import { seminarHalls, mockBookings } from "@/data/hallsData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const pendingRequests = mockBookings.filter(booking => booking.status === "pending");
  
  // Calculate stats
  const totalHalls = seminarHalls.length;
  const totalBookings = mockBookings.length;
  const pendingCount = pendingRequests.length;
  
  // Recent pending requests for the dashboard
  const recentPendingRequests = pendingRequests.slice(0, 3);
  
  if (!user?.isAdmin) {
    navigate("/login");
    return null;
  }
  
  return (
    <div className="min-h-screen bg-academy-background">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-academy-text">Admin Dashboard</h1>
            <p className="text-academy-muted">Manage seminar hall bookings and requests</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Halls</CardDescription>
                <CardTitle className="text-3xl">{totalHalls}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-academy-muted text-sm">Available facilities</div>
                  <div className="bg-academy-blue/10 p-2 rounded-full">
                    <Building className="h-5 w-5 text-academy-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending Requests</CardDescription>
                <CardTitle className="text-3xl">{pendingCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-academy-muted text-sm">Awaiting approval</div>
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Bookings</CardDescription>
                <CardTitle className="text-3xl">{totalBookings}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-academy-muted text-sm">All time</div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Users</CardDescription>
                <CardTitle className="text-3xl">24</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-academy-muted text-sm">Registered users</div>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pending Requests</CardTitle>
                  <CardDescription>Recent booking requests awaiting approval</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/admin-requests")}
                  className="text-academy-blue border-academy-blue hover:bg-academy-blue/10"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {recentPendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {recentPendingRequests.map((request) => {
                      const hall = seminarHalls.find(h => h.id === request.hallId);
                      return (
                        <div key={request.id} className="bg-academy-background p-4 rounded-lg flex flex-col md:flex-row justify-between">
                          <div>
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                              <h4 className="font-medium text-academy-text">{hall?.name}</h4>
                            </div>
                            <p className="text-sm text-academy-muted mt-1">{request.purpose}</p>
                            <div className="flex space-x-4 mt-2">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-1 text-academy-blue" />
                                {new Date(request.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-1 text-academy-blue" />
                                {request.startTime} - {request.endTime}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-4 md:mt-0">
                            <Button
                              size="sm"
                              className="bg-academy-success hover:bg-academy-success/90 text-white"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-academy-danger text-academy-danger hover:bg-academy-danger/10"
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-academy-muted">No pending requests at the moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hall Status</CardTitle>
                <CardDescription>Overview of all seminar halls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {seminarHalls.map((hall) => (
                  <div 
                    key={hall.id}
                    className="flex items-center justify-between p-2 hover:bg-academy-background rounded-md transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm font-medium">{hall.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-academy-blue hover:bg-academy-blue/10"
                      onClick={() => navigate(`/admin-hall/${hall.id}`)}
                    >
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
