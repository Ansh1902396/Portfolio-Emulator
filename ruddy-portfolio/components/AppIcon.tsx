import { motion } from 'framer-motion';

const AppIcon = ({ icon, name, onClick, isDarkMode }) => {

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <span className={`mt-4 font-bold text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
        {name}
      </span>
    </motion.div>
  );
};

export default AppIcon;

