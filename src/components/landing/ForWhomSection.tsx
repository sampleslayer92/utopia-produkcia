
import React, { useState } from "react";
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
    <section className="py-32 px-6 bg-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-utopia-500/5 via-transparent to-neon-purple/5"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Riešenia pre každé <span className="text-utopia-500">odvetvie</span>
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {segments.map((segment, index) => (
            <button
              key={segment.id}
              onClick={() => setActiveTab(index)}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                activeTab === index
                  ? 'bg-white/10 backdrop-blur-md text-white border border-utopia-500/50 shadow-[0_0_30px_rgba(0,212,255,0.3)]'
                  : 'bg-white/5 backdrop-blur-sm text-white/70 hover:bg-white/10 hover:text-white border border-white/10 hover:border-utopia-500/30'
              }`}
            >
              <span className="text-xl">{segment.emoji}</span>
              <span>{segment.title}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-12 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/3 text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-utopia-400/20 to-neon-blue/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-utopia-500/20 shadow-[0_0_30px_rgba(0,212,255,0.2)]">
                {React.createElement(segments[activeTab].icon, {
                  className: "w-14 h-14 text-utopia-400",
                  strokeWidth: 1.5
                })}
              </div>
              <h3 className="text-3xl font-medium text-white mb-2">
                {segments[activeTab].title} {segments[activeTab].emoji}
              </h3>
            </div>
            
            <div className="md:w-2/3">
              <p className="text-xl text-white/80 mb-8 font-light">
                {segments[activeTab].content.description}
              </p>
              
              <div className="space-y-4">
                {segments[activeTab].content.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-utopia-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-utopia-500/30">
                      <span className="text-utopia-400 font-bold text-sm">✓</span>
                    </div>
                    <span className="text-white/80 font-light">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-utopia-400 font-light text-lg">
            Každý segment má vlastný onboarding. Prispôsobíme sa ti.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForWhomSection;
