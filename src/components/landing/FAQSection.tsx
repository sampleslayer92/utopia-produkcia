
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      question: "Môžem objednať viac zariadení naraz?",
      answer: "Áno, onboarding ti umožní vybrať ľubovoľný počet zariadení a služieb."
    },
    {
      question: "Musím niečo podpisovať osobne?",
      answer: "Nie, všetko podpíšeš digitálne cez mobil alebo počítač."
    },
    {
      question: "Koľko onboarding trvá?",
      answer: "Zvyčajne menej než 10 minút, schválenie do 24h."
    },
    {
      question: "Kto mi pomôže, ak si neviem rady?",
      answer: "Naša podpora je dostupná cez chat aj telefón."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section ref={ref} className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Často kladené otázky
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Collapsible
                open={openItems.includes(index)}
                onOpenChange={() => toggleItem(index)}
              >
                <CollapsibleTrigger className="w-full bg-white rounded-lg p-6 text-left hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    </motion.div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 pt-2"
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          ))}
        </div>

        {/* Microtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-lg">
            Nenašiel si odpoveď? Ozvi sa nám. Sme tu pre teba.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
