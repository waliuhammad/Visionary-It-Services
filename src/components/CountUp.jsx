import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

export default function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState("0");
  const match = String(value).match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1].includes(".") ? 1 : 0;

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: v => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, target, decimals]);

  return <span ref={ref}>{display}{suffix}</span>;
}
