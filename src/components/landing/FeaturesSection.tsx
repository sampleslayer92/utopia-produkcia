
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Layout, Star } from "lucide-react";

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: Users,
      title: "Partner Management",
      description: "Comprehensive partner onboarding and management system with real-time collaboration tools.",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0,
    },
    {
      icon: Layout,
      title: "Admin Dashboard",
      description: "Powerful admin interface with advanced analytics, reporting, and merchant oversight capabilities.",
      gradient: "from-purple-500 to-pink-500",
      delay: 0.2,
    },
    {
      icon: Star,
      title: "Merchant Solutions",
      description: "Complete merchant acquisition platform with automated workflows and compliance management.",
      gradient: "from-emerald-500 to-teal-500",
      delay: 0.4,
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
            Powerful Features
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Everything you need to scale your merchant acquisition process with cutting-edge fintech solutions
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, rotateX: -10 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: feature.delay }}
              whileHover={{ 
                y: -10, 
                rotateX: 5,
                transition: { duration: 0.3 }
              }}
              className="group"
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm h-full hover:border-slate-700 transition-all duration-500">
                <CardContent className="p-8">
                  {/* Icon with gradient background */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:shadow-2xl transition-all duration-500`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-500">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-500">
                    {feature.description}
                  </p>

                  {/* Hover effect line */}
                  <motion.div
                    className={`h-1 bg-gradient-to-r ${feature.gradient} mt-6 rounded-full`}
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
