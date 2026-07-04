// src/animations/variants.js

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4
    }
  })
};

export const buttonHover = {
  whileHover: {
    scale: 1.03
  },
  whileTap: {
    scale: 0.96
  }
};