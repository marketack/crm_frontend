import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";

const AnimatedButton: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button variant="contained" color="secondary" onClick={onClick}>
        {text}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
