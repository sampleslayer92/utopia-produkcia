
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { value: 1000, suffix: "+", label: "Active Merchants", duration: 2 },
    { value: 50, suffix: "M+", label: "Transactions Processed", duration: 2.5 },
    { value: 99.9, suffix: "%", label: "Uptime Guarantee", duration: 2 },
    { value: 24, suffix: "/7", label: "Support Available", duration: 1.5 },
  ];

  return (
    <section ref={ref} className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Trusted Worldwide
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Join thousands of businesses that trust Utopia for their merchant acquisition needs
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Testimonial carousel preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20"
        >
          <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <blockquote className="text-2xl font-light text-slate-300 mb-6 italic">
                  "Utopia transformed our merchant acquisition process. We've seen a 300% increase in successful onboarding."
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">JS</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">John Smith</p>
                    <p className="text-slate-400">CEO, TechFinance</p>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

const StatCard = ({ stat, index, isInView }: { stat: any; index: number; isInView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      const increment = stat.value / 60;
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev >= stat.value) {
            clearInterval(interval);
            return stat.value;
          }
          return Math.min(prev + increment, stat.value);
        });
      }, stat.duration * 1000 / 60);

      return () => clearInterval(interval);
    }, index * 200);

    return () => clearTimeout(timer);
  }, [isInView, stat.value, stat.duration, index]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="text-center group cursor-pointer"
    >
      <Card className="bg-slate-900/30 border-slate-800 backdrop-blur-sm hover:border-slate-600 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
        <CardContent className="p-8">
          <motion.div
            className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-500"
            animate={isInView ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            {Math.round(count)}{stat.suffix}
          </motion.div>
          <p className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors duration-500">
            {stat.label}
          </p>
          
          {/* Progress bar */}
          <motion.div
            className="h-1 bg-slate-800 rounded-full mt-4 overflow-hidden"
            initial={{ width: 0 }}
            animate={isInView ? { width: "100%" } : {}}
            transition={{ duration: 1, delay: index * 0.1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={isInView ? { width: `${(count / stat.value) * 100}%` } : {}}
              transition={{ duration: stat.duration, delay: index * 0.2 }}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsSection;
