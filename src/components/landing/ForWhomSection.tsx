
import { useState } from "react";
import { UtensilsCrossed, ShoppingBag, Briefcase, Zap } from "lucide-react";

const ForWhomSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const segments = [
    {
      id: 'gastro',
      title: 'Gastro',
      icon: UtensilsCrossed,
      emoji: '🍽️',
      content: {
        description: 'Reštaurácie, bary, kaviarne – máme pre vás:',
        features: [
          'Pokladne s QR menu',
          'Terminály s možnosťou tringeltu',
          'Rýchle schválenie do 24h'
        ]
      }
    },
    {
      id: 'retail',
      title: 'Retail',
      icon: ShoppingBag,
      emoji: '🛍️',
      content: {
        description: 'Predajne, butiky, trafiky:',
        features: [
          'Všetko na jednom zariadení',
          'Integrácia s e-shopom',
          'Zákaznícka podpora 7 dní v týždni'
        ]
      }
    },
    {
      id: 'services',
      title: 'Služby',
      icon: Briefcase,
      emoji: '💼',
      content: {
        description: 'Od kaderníctiev po poradne:',
        features: [
          'Jednoduché riešenie na fakturáciu a platby',
          'Žiadne fixné poplatky',
          'Digitálny podpis zmluvy'
        ]
      }
    },
    {
      id: 'emobility',
      title: 'E-mobilita',
      icon: Zap,
      emoji: '⚡',
      content: {
        description: 'Nabíjacie stanice a prenajímatelia:',
        features: [
          'Terminály pre verejné aj súkromné nabíjanie',
          'SIM/WiFi konektivita',
          'Integrácia do existujúcich sietí'
        ]
      }
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-utopia-50/30 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Riešenia pre každé odvetvie
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {segments.map((segment, index) => (
            <button
              key={segment.id}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === index
                  ? 'bg-utopia-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-utopia-50 hover:text-utopia-600 shadow-md'
              }`}
            >
              <span className="text-xl">{segment.emoji}</span>
              <span>{segment.title}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-utopia-400 to-utopia-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                {React.createElement(segments[activeTab].icon, {
                  className: "w-12 h-12 text-white"
                })}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {segments[activeTab].title} {segments[activeTab].emoji}
              </h3>
            </div>
            
            <div className="md:w-2/3">
              <p className="text-lg text-gray-600 mb-6">
                {segments[activeTab].content.description}
              </p>
              
              <div className="space-y-3">
                {segments[activeTab].content.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-utopia-100 rounded-full flex items-center justify-center">
                      <span className="text-utopia-600 font-bold text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-utopia-600 font-medium">
            Každý segment má vlastný onboarding. Prispôsobíme sa ti.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForWhomSection;
