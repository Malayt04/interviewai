import React from "react";
import { motion } from "framer-motion";

interface StatsCardProps {
  platform: string;
  stats: {
    label: string;
    value: string | number;
  }[];
  icon: React.ReactNode;
}

const StatsCard= ({ platform, stats, icon }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {platform}
        </h3>
      </div>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ x: 2 }}
            className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <span className="text-gray-600 dark:text-gray-300">
              {stat.label}
            </span>
            <span className="font-medium text-gray-800 dark:text-white">
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StatsCard;