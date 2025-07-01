
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
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

  return (
    <section className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-light-gray-50/30 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Často kladené <span className="bg-blue-gradient bg-clip-text text-transparent">otázky</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Odpovede na najčastejšie otázky o našich službách
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-6">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white border border-gray-200 rounded-2xl px-8 animate-fade-in-up hover:shadow-lg hover:border-utopia-300 transition-all duration-300 shadow-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-utopia-600 transition-colors py-6 text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-2 pb-6 text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-16">
          <div className="bg-utopia-50 border border-utopia-200 rounded-2xl p-6 inline-block">
            <p className="text-utopia-700 font-medium text-lg">
              ❓ Nenašiel si odpoveď? Ozvi sa nám. Sme tu pre teba.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
