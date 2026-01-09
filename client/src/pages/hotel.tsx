import { motion } from "framer-motion";
import { Construction } from "lucide-react";

export default function HotelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6"
      >
        <Construction className="w-24 h-24 mx-auto text-purple-400 mb-6" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          준비중
        </h1>
        <p className="text-gray-500 text-lg">
          Coming Soon
        </p>
      </motion.div>
    </div>
  );
}
