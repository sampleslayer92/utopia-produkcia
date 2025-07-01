
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
    <section className="py-32 px-6 bg-dark relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-utopia-500/5 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Často kladené <span className="text-utopia-500">otázky</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-6">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 animate-fade-in-up hover:bg-white/10 hover:border-utopia-500/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AccordionTrigger className="text-left font-medium text-white hover:text-utopia-400 transition-colors py-6 text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-white/70 pt-2 pb-6 font-light text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-16">
          <p className="text-utopia-400 font-light text-lg">
            Nenašiel si odpoveď? Ozvi sa nám. Sme tu pre teba.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
