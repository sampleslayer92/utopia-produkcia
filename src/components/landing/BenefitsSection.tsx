
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Brain, FileText, Shield } from "lucide-react";

const BenefitsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const benefits = [
    {
      icon: CreditCard,
      title: "Prepojenie na platobné brány",
      description: "Global Payments, SumUp, GP WebPay a ďalší.",
      color: "from-blue-500 to-blue-600",
      delay: 0,
    },
    {
      icon: Brain,
      title: "Smart výber zariadení",
      description: "Na základe tvojej firmy odporučíme vhodné riešenia.",
      color: "from-primary to-primary-dark",
      delay: 0.1,
    },
    {
      icon: FileText,
      title: "Online podpis zmluvy",
      description: "Žiadna tlač ani skenovanie – podpisuješ digitálne.",
      color: "from-purple-500 to-purple-600",
      delay: 0.2,
    },
    {
      icon: Shield,
      title: "Bezpečné & rýchle",
      description: "Cloudové riešenie s dôrazom na GDPR a stabilitu.",
      color: "from-green-500 to-emerald-500",
      delay: 0.3,
    },
  ];

  return (
    <section ref={ref} className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Prečo si firmy vyberajú UTOPIU?
          </h2>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: benefit.delay }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`flex-shrink-0 p-4 rounded-xl bg-gradient-to-r ${benefit.color} text-white group-hover:shadow-lg transition-all duration-300`}
                    >
                      <benefit.icon className="h-6 w-6" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-primary transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
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
            Viac než 90 % používateľov dokončí onboarding v jeden deň.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
