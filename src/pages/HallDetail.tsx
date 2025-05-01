
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Clock, Check, CalendarIcon, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { seminarHalls, getAvailableTimeSlots } from "@/data/hallsData";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

const bookingSchema = z.object({
  date: z.string().min(1, "Please select a date"),
  startTime: z.string().min(1, "Please select a start time"),
  endTime: z.string().min(1, "Please select an end time"),
  purpose: z.string().min(5, "Please describe the purpose of your booking"),
  attendees: z.string().min(1, "Please enter the number of attendees").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Number of attendees must be a positive number",
  }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const HallDetail = () => {
  const { hallId } = useParams<{ hallId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  
  const hall = seminarHalls.find(h => h.id === hallId);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  if (!hall) {
    return <div>Hall not found</div>;
  }
  
  const availableTimeSlots = getAvailableTimeSlots(hall.id);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: "",
      startTime: "",
      endTime: "",
      purpose: "",
      attendees: "",
    },
  });
  
  const onSubmit = (data: BookingFormValues) => {
    console.log(data);
    
    // Simulate a booking submission
    setTimeout(() => {
      toast.success("Booking request submitted successfully!");
      setIsBookingDialogOpen(false);
      navigate("/my-bookings");
    }, 1500);
  };
  
  // Get unique available dates
  const availableDates = Array.from(
    new Set(availableTimeSlots.map(slot => slot.date))
  );
  
  // Get time slots for the selected date
  const timeSlotsForSelectedDate = selectedDate
    ? availableTimeSlots.filter(slot => slot.date === selectedDate && slot.isAvailable)
    : [];
  
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    form.setValue("date", date);
    form.setValue("startTime", "");
    form.setValue("endTime", "");
  };

  return (
    <div className="min-h-screen bg-academy-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate(-1)}
          variant="outline" 
          className="mb-6"
        >
          ← Back to halls
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="h-64 md:h-96 overflow-hidden">
            <img 
              src={hall.image} 
              alt={hall.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-academy-text">{hall.name}</h1>
                <div className="flex items-center mt-2 text-academy-muted">
                  <MapPin size={18} className="mr-1" />
                  <span>{hall.block} Block</span>
                </div>
              </div>
              
              <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4 md:mt-0 bg-academy-blue hover:bg-academy-light-blue">
                    Book This Hall
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Book {hall.name}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  value={field.value}
                                  onChange={(e) => handleDateChange(e.target.value)}
                                >
                                  <option value="" disabled>Select date</option>
                                  {availableDates.map(date => (
                                    <option key={date} value={date}>
                                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={!selectedDate}
                                  >
                                    <option value="" disabled>Select time</option>
                                    {timeSlotsForSelectedDate.map(slot => (
                                      <option key={`start-${slot.id}`} value={slot.startTime}>
                                        {slot.startTime}
                                      </option>
                                    ))}
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={!form.watch("startTime")}
                                  >
                                    <option value="" disabled>Select time</option>
                                    {form.watch("startTime") && timeSlotsForSelectedDate
                                      .filter(slot => slot.startTime > form.watch("startTime"))
                                      .map(slot => (
                                        <option key={`end-${slot.id}`} value={slot.endTime}>
                                          {slot.endTime}
                                        </option>
                                      ))}
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="purpose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Purpose</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe the purpose of your booking"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="attendees"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Attendees</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter number of attendees"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex gap-3 justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsBookingDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-academy-blue hover:bg-academy-light-blue"
                        >
                          Submit Request
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">About this Hall</h2>
                <p className="text-academy-text mb-6">{hall.description}</p>
                
                <h3 className="text-lg font-semibold mb-3">Features & Amenities</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {hall.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-academy-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Add any additional information or rules here */}
              </div>
              
              <div className="bg-academy-background rounded-lg p-6">
                <h3 className="font-semibold mb-4">Hall Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-academy-blue" />
                    <div>
                      <div className="font-medium">Capacity</div>
                      <div className="text-academy-muted">{hall.capacity} persons</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-academy-blue" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-academy-muted">{hall.block} Block</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-3 text-academy-blue" />
                    <div>
                      <div className="font-medium">Availability</div>
                      <div className="text-academy-muted">9:00 AM - 6:00 PM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-academy-blue" />
                    <div>
                      <div className="font-medium">Booking Duration</div>
                      <div className="text-academy-muted">Minimum 1 hour</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default HallDetail;
