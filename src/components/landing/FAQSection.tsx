
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
    <section className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Často kladené otázky
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-gray-50 rounded-xl px-6 border-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-utopia-600 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-utopia-600 font-medium">
            Nenašiel si odpoveď? Ozvi sa nám. Sme tu pre teba.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
