import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, Bookmark } from "lucide-react";
import Navbar from "@/components/Navbar";
import HallCard from "@/components/HallCard";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { seminarHalls } from "@/data/hallsData";
import { SeminarHall } from "@/types";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [filteredHalls, setFilteredHalls] = useState<SeminarHall[]>(seminarHalls);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const blocks = ["LHC", "ESB", "DES", "APEX"];

  useEffect(() => {
    let results = seminarHalls;

    if (searchTerm) {
      results = results.filter((hall) =>
        hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hall.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBlock) {
      results = results.filter((hall) => hall.block === selectedBlock);
    }

    setFilteredHalls(results);
  }, [searchTerm, selectedBlock]);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-academy-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-academy-text">
                Welcome, {user.name || "User"}
              </h1>
              <p className="text-academy-muted">
                Browse and book seminar halls for your events
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button variant="outline" onClick={() => navigate("/my-bookings")}>
                <Calendar className="h-4 w-4 mr-2" />
                My Bookings
              </Button>
              <Button
                className="bg-academy-blue hover:bg-academy-light-blue"
                onClick={() => navigate("/book")}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div
                className={`flex-grow relative ${
                  isSearchFocused ? "ring-2 ring-academy-blue rounded-md" : ""
                }`}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-academy-muted h-5 w-5" />
                <Input
                  placeholder="Search for seminar halls by name or description..."
                  className="pl-10 h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>

              <div className="flex-shrink-0 flex gap-2 overflow-x-auto pb-2">
                <Button
                  variant={selectedBlock === null ? "default" : "outline"}
                  className={
                    selectedBlock === null
                      ? "bg-academy-blue hover:bg-academy-light-blue"
                      : ""
                  }
                  onClick={() => setSelectedBlock(null)}
                >
                  All Blocks
                </Button>

                {blocks.map((block) => (
                  <Button
                    key={block}
                    variant={selectedBlock === block ? "default" : "outline"}
                    className={
                      selectedBlock === block
                        ? "bg-academy-blue hover:bg-academy-light-blue"
                        : ""
                    }
                    onClick={() =>
                      setSelectedBlock(block === selectedBlock ? null : block)
                    }
                  >
                    {block}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {filteredHalls.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-academy-background rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-academy-muted" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No halls found</h3>
              <p className="text-academy-muted">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHalls.map((hall) => (
                <HallCard key={hall.id} hall={hall} />
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
