
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Enhanced light theme colors for 2025
				light: {
					DEFAULT: '#ffffff',
					gray: {
						50: '#f8fafc',
						100: '#f1f5f9',
						200: '#e2e8f0',
						300: '#cbd5e1',
						400: '#94a3b8',
						500: '#64748b',
						600: '#475569',
						700: '#334155',
						800: '#1e293b',
						900: '#0f172a'
					}
				},
				// Ultra-modern blue system
				blue: {
					DEFAULT: '#0066ff',
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
					gradient: {
						from: '#0066ff',
						to: '#00d4ff'
					}
				},
				// Premium accent palette
				accent: {
					yellow: '#fbbf24',
					orange: '#f97316',
					pink: '#ec4899',
					green: '#10b981',
					purple: '#8b5cf6',
					cyan: '#06b6d4'
				},
				// UTOPIA brand colors - enhanced
				utopia: {
					DEFAULT: '#0066ff',
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0066ff',
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
					light: '#00d4ff',
					glow: 'rgba(0, 102, 255, 0.4)',
					'glow-soft': 'rgba(0, 102, 255, 0.15)',
					'glass': 'rgba(0, 102, 255, 0.08)'
				},
				// Glassmorphism colors
				glass: {
					white: 'rgba(255, 255, 255, 0.15)',
					'white-soft': 'rgba(255, 255, 255, 0.08)',
					blue: 'rgba(0, 102, 255, 0.15)',
					'blue-soft': 'rgba(0, 102, 255, 0.08)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backdropBlur: {
				xs: '2px',
				'4xl': '72px'
			},
			fontSize: {
				'7xl': '4.5rem',
				'8xl': '6rem',
				'9xl': '8rem',
				'10xl': '12rem',
				'11xl': '16rem'
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem'
			},
			perspective: {
				'1000': '1000px',
				'2000': '2000px'
			},
			rotate: {
				'x-12': 'rotateX(12deg)',
				'x-24': 'rotateX(24deg)',
				'y-12': 'rotateY(12deg)',
				'y-24': 'rotateY(24deg)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// Premium micro-animations
				'magnetic': {
					'0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
					'100%': { transform: 'translate3d(var(--mouse-x, 0), var(--mouse-y, 0), 0) scale(1.05)' }
				},
				'morph': {
					'0%': { borderRadius: '20px', transform: 'rotate(0deg)' },
					'50%': { borderRadius: '50px', transform: 'rotate(180deg) scale(1.1)' },
					'100%': { borderRadius: '20px', transform: 'rotate(360deg)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgba(0, 102, 255, 0.3), 0 0 40px rgba(0, 102, 255, 0.1)',
						filter: 'brightness(1)'
					},
					'50%': { 
						boxShadow: '0 0 40px rgba(0, 102, 255, 0.6), 0 0 80px rgba(0, 102, 255, 0.2)',
						filter: 'brightness(1.1)'
					}
				},
				'float-3d': {
					'0%, 100%': { 
						transform: 'translateY(0px) rotateX(0deg) rotateY(0deg)' 
					},
					'33%': { 
						transform: 'translateY(-10px) rotateX(5deg) rotateY(5deg)' 
					},
					'66%': { 
						transform: 'translateY(-5px) rotateX(-3deg) rotateY(-3deg)' 
					}
				},
				'text-shimmer': {
					'0%': { backgroundPosition: '-200% center' },
					'100%': { backgroundPosition: '200% center' }
				},
				'tilt': {
					'0%': { transform: 'rotateY(0deg) rotateX(0deg)' },
					'100%': { transform: 'rotateY(var(--tilt-y, 12deg)) rotateX(var(--tilt-x, 12deg))' }
				},
				'bounce-3d': {
					'0%, 20%, 53%, 80%, 100%': {
						transform: 'translate3d(0, 0, 0) rotateX(0deg)'
					},
					'40%, 43%': {
						transform: 'translate3d(0, -30px, 0) rotateX(-10deg)'
					},
					'70%': {
						transform: 'translate3d(0, -15px, 0) rotateX(-5deg)'
					},
					'90%': {
						transform: 'translate3d(0, -4px, 0) rotateX(-2deg)'
					}
				},
				'gradient-shift': {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				},
				'stagger-fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(40px) scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				// Advanced reveal animations
				'letter-reveal': {
					'0%': {
						transform: 'translateY(100%) rotateX(-90deg)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0%) rotateX(0deg)',
						opacity: '1'
					}
				},
				'mask-reveal': {
					'0%': {
						clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)'
					},
					'100%': {
						clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				
				// Premium animations
				'magnetic': 'magnetic 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
				'morph': 'morph 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
				'float-3d': 'float-3d 4s ease-in-out infinite',
				'text-shimmer': 'text-shimmer 3s linear infinite',
				'tilt': 'tilt 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
				'bounce-3d': 'bounce-3d 2s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
				'stagger-fade-in': 'stagger-fade-in 0.8s cubic-bezier(0.23, 1, 0.32, 1) both',
				'letter-reveal': 'letter-reveal 0.8s cubic-bezier(0.23, 1, 0.32, 1) both',
				'mask-reveal': 'mask-reveal 1.2s cubic-bezier(0.23, 1, 0.32, 1) both',
				
				// Grouped animations
				'premium-entrance': 'stagger-fade-in 0.8s cubic-bezier(0.23, 1, 0.32, 1) both, glow-pulse 3s ease-in-out infinite 1s',
				'card-hover': 'tilt 0.3s cubic-bezier(0.23, 1, 0.32, 1), glow-pulse 0.5s ease-out'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'blue-gradient': 'linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)',
				'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
				'mesh-gradient': 'radial-gradient(at 40% 20%, #0066ff33 0%, transparent 50%), radial-gradient(at 80% 0%, #00d4ff33 0%, transparent 50%), radial-gradient(at 0% 50%, #8b5cf633 0%, transparent 50%)',
				'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
				'text-shimmer': 'linear-gradient(90deg, #64748b, #0066ff, #00d4ff, #64748b)'
			},
			boxShadow: {
				'glass': '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
				'neomorphism': '12px 12px 24px rgba(0, 0, 0, 0.1), -12px -12px 24px rgba(255, 255, 255, 0.7)',
				'neomorphism-inset': 'inset 6px 6px 12px rgba(0, 0, 0, 0.1), inset -6px -6px 12px rgba(255, 255, 255, 0.7)',
				'premium': '0 20px 40px rgba(0, 102, 255, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
				'glow': '0 0 40px rgba(0, 102, 255, 0.3)',
				'glow-lg': '0 0 80px rgba(0, 102, 255, 0.4)',
				'3d': '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
			},
			transitionTimingFunction: {
				'premium': 'cubic-bezier(0.23, 1, 0.32, 1)',
				'bounce-soft': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }) {
			addUtilities({
				'.perspective-1000': {
					perspective: '1000px'
				},
				'.preserve-3d': {
					transformStyle: 'preserve-3d'
				},
				'.backface-hidden': {
					backfaceVisibility: 'hidden'
				},
				'.magnetic-hover': {
					'&:hover': {
						animation: 'magnetic 0.3s cubic-bezier(0.23, 1, 0.32, 1) forwards'
					}
				},
				'.glass-card': {
					background: 'rgba(255, 255, 255, 0.15)',
					backdropFilter: 'blur(12px)',
					border: '1px solid rgba(255, 255, 255, 0.2)',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
				}
			})
		}
	],
} satisfies Config;
