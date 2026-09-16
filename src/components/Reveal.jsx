import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";

export default function Reveal({ children, variants = fadeUp, delay = 0, className = "", as = "div" }) {
  const MotionTag = motion[as] ?? motion.div;
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
