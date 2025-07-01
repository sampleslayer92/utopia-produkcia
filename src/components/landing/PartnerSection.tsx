
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, ArrowRight } from "lucide-react";

const PartnerSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 px-6 bg-gradient-to-br from-primary/5 via-white to-primary/10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl overflow-hidden">
            <CardContent className="p-12">
              <div className="text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex p-6 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white mb-8"
                >
                  <Handshake className="h-12 w-12" />
                </motion.div>

                {/* Quote */}
                <motion.blockquote
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                >
                  "Pomáhame partnerom rásť."
                </motion.blockquote>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-xl text-gray-600 mb-8"
                >
                  Máš klientov? My máme technológiu.
                </motion.p>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-6 text-lg font-semibold group shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Chcem byť partner
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                {/* Microtext */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="text-gray-500 text-sm mt-6"
                >
                  Získaš prístup do nášho portálu a provízny program.
                </motion.p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnerSection;
