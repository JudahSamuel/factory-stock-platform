// src/animations/variants.js

export const pageVariants = {

  initial: {

    opacity: 0,

    filter: "blur(8px)"

  },

  animate: {

    opacity: 1,

    filter: "blur(0px)",

    transition: {

      duration: 0.45,

      ease: "easeOut"

    }

  },

  exit: {

    opacity: 0,

    filter: "blur(8px)",

    transition: {

      duration: 0.25

    }

  }

};

export const cardVariants = {

  hidden: {

    opacity: 0,

    y: 25

  },

  visible: (i = 1) => ({

    opacity: 1,

    y: 0,

    transition: {

      delay: i * 0.08,

      duration: 0.35

    }

  })

};

export const buttonHover = {

  whileHover: {

    scale: 1.04

  },

  whileTap: {

    scale: 0.96

  }

};