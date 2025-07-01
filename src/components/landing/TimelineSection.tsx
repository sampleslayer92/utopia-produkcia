
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

const TimelineSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    {
      step: "01",
      title: "Partner Registration",
      description: "Quick and secure partner onboarding with automated KYC verification and compliance checks.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "02", 
      title: "Merchant Acquisition",
      description: "Streamlined merchant onboarding process with intelligent form filling and document management.",
      color: "from-purple-500 to-pink-500",
    },
    {
      step: "03",
      title: "Contract Management",
      description: "Automated contract generation, digital signatures, and real-time status tracking.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      step: "04",
      title: "Go Live",
      description: "Seamless activation with ongoing support, analytics, and performance monitoring.",
      color: "from-orange-500 to-red-500",
    },
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
            How It Works
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Our streamlined process gets you from registration to revenue in just a few simple steps
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 rounded-full"
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : {}}
            transition={{ duration: 2, delay: 0.5 }}
          />

          <div className="space-y-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-col md:gap-20 gap-8`}
              >
                {/* Content */}
                <div className="flex-1 max-w-lg">
                  <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all duration-500 group">
                    <CardContent className="p-8">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} text-white font-bold text-lg mb-4`}
                      >
                        {step.step}
                      </motion.div>
                      
                      <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-500">
                        {step.title}
                      </h3>
                      
                      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-500">
                        {step.description}
                      </p>

                      {/* Progress indicator */}
                      <motion.div
                        className={`h-1 bg-gradient-to-r ${step.color} mt-6 rounded-full`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: "100%" } : {}}
                        transition={{ duration: 1, delay: index * 0.3 + 1 }}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                  className="relative"
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      className="w-3 h-3 bg-white rounded-full"
                    />
                  </div>
                  
                  {/* Pulse effect */}
                  <motion.div
                    animate={{ scale: [0, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.color}`}
                  />
                </motion.div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 max-w-lg hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
