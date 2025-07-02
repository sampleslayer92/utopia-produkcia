import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AnimationsSection = () => {
  const [triggerAnimation, setTriggerAnimation] = useState<string | null>(null);

  const animations = [
    {
      name: 'fade-in',
      duration: '0.6s ease-out',
      description: 'Smooth fade in with slight upward movement',
      keyframes: 'opacity: 0 → 1, translateY: 20px → 0',
      usage: 'Page transitions, content reveals'
    },
    {
      name: 'fade-in-up',
      duration: '0.8s ease-out',
      description: 'Fade in with more pronounced upward movement',
      keyframes: 'opacity: 0 → 1, translateY: 30px → 0',
      usage: 'Hero sections, large content blocks'
    },
    {
      name: 'scale-in',
      duration: '0.5s ease-out',
      description: 'Scale from smaller to normal size',
      keyframes: 'opacity: 0 → 1, scale: 0.9 → 1',
      usage: 'Modals, popovers, tooltips'
    },
    {
      name: 'float',
      duration: '3s ease-in-out infinite',
      description: 'Gentle floating motion',
      keyframes: 'translateY: 0 → -10px → 0',
      usage: 'Decorative elements, call-to-action'
    },
    {
      name: 'glow',
      duration: '3s ease-in-out infinite',
      description: 'Pulsing glow effect',
      keyframes: 'boxShadow: light → intense → light',
      usage: 'Premium features, notifications'
    },
    {
      name: 'gradient-shift',
      duration: '8s ease-in-out infinite',
      description: 'Animated gradient background',
      keyframes: 'backgroundPosition: 0% → 100% → 0%',
      usage: 'Hero backgrounds, premium cards'
    },
    {
      name: 'bounce-gentle',
      duration: '2s ease-in-out infinite',
      description: 'Subtle bouncing motion',
      keyframes: 'translateY: 0 → -5px → 0',
      usage: 'Icons, small interactive elements'
    }
  ];

  const interactiveAnimations = [
    {
      name: 'hover:scale-105',
      description: 'Slight scale on hover',
      trigger: 'hover',
      usage: 'Buttons, cards, interactive elements'
    },
    {
      name: 'hover:shadow-lg',
      description: 'Enhanced shadow on hover',
      trigger: 'hover',
      usage: 'Cards, buttons'
    },
    {
      name: 'focus:ring-2',
      description: 'Focus ring for accessibility',
      trigger: 'focus',
      usage: 'Form inputs, buttons'
    },
    {
      name: 'transition-all',
      description: 'Smooth transitions for all properties',
      trigger: 'state change',
      usage: 'Universal smooth animations'
    }
  ];

  const triggerDemo = (animation: string) => {
    setTriggerAnimation(animation);
    setTimeout(() => setTriggerAnimation(null), 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Animation System</h1>
        <p className="text-slate-600 mb-6">
          Konzistentný systém animácií pre vytvorenie živých a interaktívnych používateľských rozhraní.
        </p>
      </div>

      {/* Core Animations */}
      <Card>
        <CardHeader>
          <CardTitle>Core Animations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {animations.map((animation) => (
              <div key={animation.name} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{animation.name}</h3>
                  <Badge variant="outline" className="font-mono text-xs">
                    animate-{animation.name}
                  </Badge>
                </div>
                
                <div className="text-sm text-slate-600 space-y-1">
                  <div>{animation.description}</div>
                  <div className="font-mono text-xs bg-slate-50 p-2 rounded">
                    {animation.keyframes}
                  </div>
                  <div className="text-xs"><strong>Použitie:</strong> {animation.usage}</div>
                  <div className="text-xs"><strong>Trvanie:</strong> {animation.duration}</div>
                </div>

                {/* Live Demo */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Live Demo:</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => triggerDemo(animation.name)}
                    >
                      Trigger
                    </Button>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg min-h-[60px] flex items-center justify-center">
                    <div 
                      className={`
                        bg-blue-500 text-white px-4 py-2 rounded
                        ${triggerAnimation === animation.name ? `animate-${animation.name}` : ''}
                      `}
                    >
                      Demo Element
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Animations */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Animations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interactiveAnimations.map((animation) => (
              <div key={animation.name} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{animation.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {animation.trigger}
                  </Badge>
                </div>
                
                <div className="text-sm text-slate-600 space-y-1">
                  <div>{animation.description}</div>
                  <div className="text-xs"><strong>Použitie:</strong> {animation.usage}</div>
                </div>

                {/* Interactive Demo */}
                <div className="border-t pt-4">
                  <span className="text-sm font-medium block mb-3">Interactive Demo:</span>
                  <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-center">
                    {animation.name.includes('hover') && (
                      <div className={`
                        bg-white border px-4 py-2 rounded cursor-pointer
                        transition-all duration-200 ${animation.name}
                      `}>
                        Hover me
                      </div>
                    )}
                    {animation.name.includes('focus') && (
                      <input 
                        className={`
                          px-3 py-2 border rounded
                          transition-all duration-200 ${animation.name} focus:ring-blue-500
                        `}
                        placeholder="Focus me"
                      />
                    )}
                    {animation.name.includes('transition') && (
                      <button className={`
                        px-4 py-2 bg-blue-500 text-white rounded
                        hover:bg-blue-600 ${animation.name} duration-200
                      `}>
                        Smooth transitions
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Complex Animation Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Complex Animation Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Card Animation */}
            <div>
              <h3 className="font-semibold mb-4">Animated Card</h3>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border animate-fade-in hover:scale-105 transition-transform duration-200 cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center animate-bounce-gentle">
                    <span className="text-white font-bold">🚀</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Premium Feature</h4>
                    <p className="text-slate-600 text-sm">
                      Kombinuje fade-in, hover scale, a bounce animácie
                    </p>
                  </div>
                </div>
              </div>
              <code className="text-xs text-slate-600 mt-2 block">
                animate-fade-in hover:scale-105 transition-transform duration-200
              </code>
            </div>

            {/* Button States */}
            <div>
              <h3 className="font-semibold mb-4">Button Animation States</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 hover:shadow-lg">
                  Hover Effect
                </button>
                <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300">
                  State Change
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg animate-gradient-shift hover:scale-105 transition-transform duration-200" style={{ backgroundSize: '200% 200%' }}>
                  Gradient Animation
                </button>
              </div>
            </div>

            {/* Loading States */}
            <div>
              <h3 className="font-semibold mb-4">Loading Animations</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm text-slate-600">Loading dots</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-slate-600">Spinning loader</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded animate-pulse"></div>
                  <span className="text-sm text-slate-600">Pulse effect</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">✨ Best Practices</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Používaj animácie pre feedback a orientáciu</li>
                <li>• Dodržuj konzistentné trvanie animácií (200ms-300ms pre interakcie)</li>
                <li>• Používaj ease-out pre prirodzený pohyb</li>
                <li>• Testuj animácie na pomalších zariadeniach</li>
                <li>• Rešpektuj prefers-reduced-motion setting</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Tailwind Configuration</h4>
              <pre className="text-xs font-mono text-slate-700 overflow-x-auto">
{`// tailwind.config.ts
animation: {
  'fade-in': 'fade-in 0.6s ease-out',
  'scale-in': 'scale-in 0.5s ease-out',
  'float': 'float 3s ease-in-out infinite',
  'glow': 'glow 3s ease-in-out infinite',
  'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite'
}

keyframes: {
  'fade-in': {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' }
  }
}`}
              </pre>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">⚡ Performance Tips</h4>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• Animuj len transform a opacity properties</li>
                <li>• Používaj will-change: transform pre komplexné animácie</li>
                <li>• Kombinuj CSS transitions s JS pre komplexné interakcie</li>
                <li>• Používaj animation-fill-mode: forwards pre trvalé stavy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimationsSection;