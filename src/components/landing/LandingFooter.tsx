
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const LandingFooter = () => {
  const navigationLinks = {
    "O nás": "#",
    "Kontakt": "#",
    "Obchodné podmienky": "#",
    "GDPR": "#",
  };

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="py-16 px-6 bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Logo and description */}
          <div className="md:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-6 cursor-pointer"
            >
              <img 
                src="https://famouscreative.eu/wp-content/uploads/2025/07/logo_utopia_svg.svg" 
                alt="Utopia" 
                className="h-12 w-auto brightness-0 invert"
              />
            </motion.div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-sm">
              Budúcnosť fintech onboardingu - objednaj si pokladňu, terminál alebo softvér online.
            </p>
            
            {/* Mini CTA */}
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              Prihlásiť sa do portálu
            </Button>
          </div>

          {/* Navigation */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-white mb-6">Navigácia</h4>
            <ul className="space-y-3">
              {Object.entries(navigationLinks).map(([label, href]) => (
                <li key={label}>
                  <motion.a
                    href={href}
                    whileHover={{ x: 5 }}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-white mb-6">Sleduj nás</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-gray-400"
          >
            © 2025 UTOPIA – Onboarding pre nový digitálny svet
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
