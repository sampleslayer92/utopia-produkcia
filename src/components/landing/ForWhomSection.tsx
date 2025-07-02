
import React, { useState } from "react";
import { UtensilsCrossed, ShoppingBag, Briefcase, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const ForWhomSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation('landing');

  const segments = [
    {
      id: 'gastro',
      title: t('segments.gastro.title'),
      icon: UtensilsCrossed,
      emoji: '🍽️',
      content: {
        description: t('segments.gastro.description'),
        features: t('segments.gastro.features', { returnObjects: true }) as string[]
      }
    },
    {
      id: 'retail',
      title: t('segments.retail.title'),
      icon: ShoppingBag,
      emoji: '🛍️',
      content: {
        description: t('segments.retail.description'),
        features: t('segments.retail.features', { returnObjects: true }) as string[]
      }
    },
    {
      id: 'services',
      title: t('segments.services.title'),
      icon: Briefcase,
      emoji: '💼',
      content: {
        description: t('segments.services.description'),
        features: t('segments.services.features', { returnObjects: true }) as string[]
      }
    },
    {
      id: 'emobility',
      title: t('segments.emobility.title'),
      icon: Zap,
      emoji: '⚡',
      content: {
        description: t('segments.emobility.description'),
        features: t('segments.emobility.features', { returnObjects: true }) as string[]
      }
    }
  ];

  return (
    <section id="segments" className="py-32 px-6 bg-light-gray-50 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-utopia-50/50 via-transparent to-blue-50/50"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            {t('segments.title')} <span className="bg-blue-gradient bg-clip-text text-transparent">{t('segments.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('segments.subtitle')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {segments.map((segment, index) => (
            <button
              key={segment.id}
              onClick={() => setActiveTab(index)}
              className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                activeTab === index
                  ? 'bg-white text-gray-900 border-2 border-utopia-500 shadow-lg'
                  : 'bg-white/70 text-gray-600 hover:bg-white hover:text-gray-900 border-2 border-gray-200 hover:border-utopia-300 shadow-sm'
              }`}
            >
              <span className="text-xl">{segment.emoji}</span>
              <span>{segment.title}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 animate-fade-in shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/3 text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-utopia-100 to-utopia-200 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-utopia-300 shadow-lg">
                {React.createElement(segments[activeTab].icon, {
                  className: "w-14 h-14 text-utopia-600",
                  strokeWidth: 1.5
                })}
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                {segments[activeTab].title} {segments[activeTab].emoji}
              </h3>
            </div>
            
            <div className="md:w-2/3">
              <p className="text-xl text-gray-700 mb-8 font-medium">
                {segments[activeTab].content.description}
              </p>
              
              <div className="space-y-4">
                {segments[activeTab].content.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-utopia-500 rounded-2xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-accent-yellow/20 border border-accent-yellow/40 rounded-2xl p-6 inline-block">
            <p className="text-gray-800 font-medium text-lg">
              🎯 {t('segments.note')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForWhomSection;
