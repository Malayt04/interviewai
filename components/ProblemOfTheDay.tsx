import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface ProblemOfTheDayProps {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  link: string;
}

const ProblemOfTheDay = ({ title, difficulty, description, link }: ProblemOfTheDayProps) => {
  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Hard':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Problem of the Day
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyStyles(difficulty)}`}>
          {difficulty}
        </span>
      </div>
      <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">{title}</h4>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
        whileHover={{ x: 3 }}
      >
        Solve Problem
        <ArrowRight className="w-4 h-4" />
      </motion.a>
    </motion.div>
  );
};

export default ProblemOfTheDay;