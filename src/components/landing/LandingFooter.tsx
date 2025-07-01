
import { motion } from "framer-motion";

const LandingFooter = () => {
  const footerLinks = {
    Product: ["Features", "Pricing", "Security", "Integrations"],
    Company: ["About", "Careers", "Press", "Contact"],
    Resources: ["Documentation", "Blog", "Support", "Status"],
    Legal: ["Privacy", "Terms", "Cookies", "GDPR"],
  };

  return (
    <footer className="py-20 px-6 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Logo and description */}
          <div className="col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-6"
            >
              <img 
                src="https://famouscreative.eu/wp-content/uploads/2025/07/logo_utopia_svg.svg" 
                alt="Utopia" 
                className="h-12 w-auto"
              />
            </motion.div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
              The platform where fintech meets sales to scale merchant acquisition.
            </p>
            <div className="flex space-x-4">
              {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <span className="text-sm font-semibold">
                    {social.charAt(0)}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400">
            © 2024 Utopia. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-400">
            <motion.a href="#" whileHover={{ scale: 1.05 }} className="hover:text-white transition-colors">
              Privacy Policy
            </motion.a>
            <motion.a href="#" whileHover={{ scale: 1.05 }} className="hover:text-white transition-colors">
              Terms of Service
            </motion.a>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-xl"
        />
      </div>
    </footer>
  );
};

export default LandingFooter;
