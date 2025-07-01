
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

const BenefitsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const benefits = [
    {
      title: "Automated Workflows",
      description: "Reduce manual work by 90% with intelligent automation",
      size: "large",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      title: "Real-time Analytics",
      description: "Track performance and ROI instantly",
      size: "medium",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Compliance Ready",
      description: "Built-in regulatory compliance",
      size: "small",
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "24/7 Support",
      description: "Always available expert assistance",
      size: "medium",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Scalable Infrastructure",
      description: "Grows with your business needs seamlessly",
      size: "large",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      title: "Secure Platform", 
      description: "Bank-grade security",
      size: "small",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const getSizeClass = (size: string) => {
    switch (size) {
      case "large":
        return "md:col-span-2 md:row-span-2";
      case "medium":
        return "md:col-span-2";
      default:
        return "md:col-span-1";
    }
  };

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
            Why Choose Utopia
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Experience the benefits that make Utopia the preferred choice for fintech professionals
          </p>
        </motion.div>

        {/* Masonry grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className={`${getSizeClass(benefit.size)} group cursor-pointer`}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm h-full hover:border-slate-700 transition-all duration-500 overflow-hidden">
                <CardContent className="p-8 h-full flex flex-col justify-center relative">
                  {/* Background gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    whileHover={{ scale: 1.1 }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <motion.h3
                      className="text-2xl font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-500"
                      whileHover={{ scale: 1.05 }}
                    >
                      {benefit.title}
                    </motion.h3>
                    
                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-500">
                      {benefit.description}
                    </p>

                    {/* Decorative elements */}
                    <motion.div
                      className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20"
                      style={{
                        background: `linear-gradient(135deg, ${benefit.gradient.replace('from-', '').replace(' to-', ', ')})`,
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  {/* Magnetic hover effect */}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${benefit.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Background patterns */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
