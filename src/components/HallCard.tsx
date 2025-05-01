
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SeminarHall } from "@/types";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";

interface HallCardProps {
  hall: SeminarHall;
}

const HallCard = ({ hall }: HallCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={hall.image} 
          alt={hall.name} 
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`} 
        />
      </div>
      
      <div className="absolute top-4 right-4 bg-academy-blue text-white text-xs px-2 py-1 rounded-full">
        {hall.block} Block
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-academy-text">{hall.name}</h3>
        
        <div className="flex items-center mb-4">
          <div className="flex items-center text-academy-muted">
            <Users size={18} className="mr-1" />
            <span>Capacity: {hall.capacity}</span>
          </div>
        </div>
        
        <div className="mb-5">
          <p className="text-academy-text line-clamp-2">
            {hall.description}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1 flex-wrap">
            {hall.features.slice(0, 2).map((feature, index) => (
              <span 
                key={index}
                className="inline-block text-xs bg-academy-background text-academy-muted rounded-full px-2 py-1 mb-1"
              >
                {feature}
              </span>
            ))}
            {hall.features.length > 2 && (
              <span className="inline-block text-xs bg-academy-background text-academy-muted rounded-full px-2 py-1 mb-1">
                +{hall.features.length - 2} more
              </span>
            )}
          </div>
          
          <Link to={`/hall/${hall.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-academy-blue border-academy-blue hover:bg-academy-blue hover:text-white transition-colors"
            >
              Details
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HallCard;
