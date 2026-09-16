export const EASE = [0.23, 1, 0.32, 1];

export const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const fadeLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

export const fadeRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

// Parent container for staggered children
export const stagger = (delayChildren = 0.1, staggerChildren = 0.1) => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
});
