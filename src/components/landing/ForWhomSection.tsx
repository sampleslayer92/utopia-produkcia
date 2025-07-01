
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UtensilsCrossed, ShoppingBag, Briefcase, Zap, Check } from "lucide-react";

const ForWhomSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeTab, setActiveTab] = useState(0);

  const segments = [
    {
      id: "gastro",
      title: "Gastro",
      icon: UtensilsCrossed,
      emoji: "🍽️",
      subtitle: "Reštaurácie, bary, kaviarne – máme pre vás:",
      features: [
        "Pokladne s QR menu",
        "Terminály s možnosťou tringeltu",
        "Rýchle schválenie do 24h"
      ],
      color: "from-orange-500 to-red-500"
    },
    {
      id: "retail",
      title: "Retail",
      icon: ShoppingBag,
      emoji: "🛍️",
      subtitle: "Predajne, butiky, trafiky:",
      features: [
        "Všetko na jednom zariadení",
        "Integrácia s e-shopom",
        "Zákaznícka podpora 7 dní v týždni"
      ],
      color: "from-blue-500 to-indigo-500"
    },
    {
      id: "services",
      title: "Služby",
      icon: Briefcase,
      emoji: "💼",
      subtitle: "Od kaderníctiev po poradne:",
      features: [
        "Jednoduché riešenie na fakturáciu a platby",
        "Žiadne fixné poplatky",
        "Digitálny podpis zmluvy"
      ],
      color: "from-primary to-primary-dark"
    },
    {
      id: "emobility",
      title: "E-mobilita",
      icon: Zap,
      emoji: "⚡",
      subtitle: "Nabíjacie stanice a prenajímatelia:",
      features: [
        "Terminály pre verejné aj súkromné nabíjanie",
        "SIM/WiFi konektivita",
        "Integrácia do existujúcich sietí"
      ],
      color: "from-green-500 to-emerald-500"
    },
  ];

  return (
    <section ref={ref} className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Riešenia pre každé odvetvie
          </h2>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {segments.map((segment, index) => (
            <motion.button
              key={segment.id}
              onClick={() => setActiveTab(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === index
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <segment.icon className="h-5 w-5" />
              <span className="text-xl">{segment.emoji}</span>
              {segment.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Active tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${segments[activeTab].color} text-white mb-4`}>
                  <segments[activeTab].icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {segments[activeTab].title} <span className="text-3xl ml-2">{segments[activeTab].emoji}</span>
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  {segments[activeTab].subtitle}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {segments[activeTab].features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Microtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-lg">
            Každý segment má vlastný onboarding. Prispôsobíme sa ti.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ForWhomSection;
