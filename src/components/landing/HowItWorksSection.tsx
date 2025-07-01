
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Settings, PenTool } from "lucide-react";

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    {
      icon: Search,
      title: "Vyhľadaj svoju firmu",
      description: "Zadaj názov alebo IČO a predvyplníme všetko za teba.",
      color: "from-blue-500 to-blue-600",
      delay: 0,
    },
    {
      icon: Settings,
      title: "Vyber si riešenie",
      description: "Terminál, pokladňa alebo softvér – odporučíme ti, čo sa hodí.",
      color: "from-primary to-primary-dark",
      delay: 0.2,
    },
    {
      icon: PenTool,
      title: "Vyplň, podpíš, hotovo",
      description: "Objednávku dokončíš za pár minút bez papierovania.",
      color: "from-purple-500 to-purple-600",
      delay: 0.4,
    },
  ];

  return (
    <section id="how-it-works" ref={ref} className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ako prebieha objednávka?
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: step.delay }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-8 text-center">
                  {/* Step number */}
                  <div className="mb-6">
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`inline-flex p-4 rounded-full bg-gradient-to-r ${step.color} text-white mb-4 group-hover:shadow-lg transition-all duration-300`}
                      >
                        <step.icon className="h-8 w-8" />
                      </motion.div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 text-gray-900 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Microtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-500 text-lg">
            Celý proces zaberie menej než 10 minút.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
