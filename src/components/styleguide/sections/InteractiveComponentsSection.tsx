
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import CodeBlock from '../CodeBlock';

interface InteractiveComponentsSectionProps {
  searchTerm: string;
}

const InteractiveComponentsSection: React.FC<InteractiveComponentsSectionProps> = ({ searchTerm }) => {
  if (searchTerm && !('interactive dialog modal toast accordion interaktívne').includes(searchTerm.toLowerCase())) {
    return null;
  }

  const showToast = () => {
    toast({
      title: "Toast notifikácia",
      description: "Toto je ukážková toast správa.",
    });
  };

  return (
    <section id="interactive" className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">🔄 Interaktívne komponenty</h2>
        <p className="text-muted-foreground">
          Komponenty pre interakciu s používateľom a navigáciu.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dialogs & Modals</CardTitle>
          <CardDescription>Modálne okná pre dodatočné akcie</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Otvoriť dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nadpis dialogu</DialogTitle>
                <DialogDescription>
                  Toto je obsah dialogového okna. Môžete tu pridať formuláre, informácie alebo akcie.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline">Zrušiť</Button>
                <Button>Potvrdiť</Button>
              </div>
            </DialogContent>
          </Dialog>

          <CodeBlock
            code={`// Dialog komponent
<Dialog>
  <DialogTrigger asChild>
    <Button>Otvoriť dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Nadpis</DialogTitle>
      <DialogDescription>Popis dialogu</DialogDescription>
    </DialogHeader>
    <div className="mt-4">
      <!-- Obsah dialogu -->
    </div>
  </DialogContent>
</Dialog>`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>Dočasné notifikácie pre používateľa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-x-2">
            <Button onClick={showToast}>Zobraziť toast</Button>
            <Button 
              variant="destructive"
              onClick={() => toast({
                title: "Chyba",
                description: "Nastala chyba pri spracovaní.",
                variant: "destructive"
              })}
            >
              Toast chyba
            </Button>
          </div>

          <CodeBlock
            code={`// Toast notifications
import { toast } from "@/hooks/use-toast";

// Základný toast
toast({
  title: "Úspech",
  description: "Operácia bola dokončená.",
});

// Toast s chybou
toast({
  title: "Chyba",
  description: "Nastala neočakávaná chyba.",
  variant: "destructive"
});`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accordions</CardTitle>
          <CardDescription>Rozbaľovacie sekcie pre organizáciu obsahu</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Prvá sekcia</AccordionTrigger>
              <AccordionContent>
                Obsah prvej sekcie. Toto je ukážkový text ktorý sa zobrazí po rozbalení.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Druhá sekcia</AccordionTrigger>
              <AccordionContent>
                Obsah druhej sekcie s ďalšími informáciami.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Tretia sekcia</AccordionTrigger>
              <AccordionContent>
                Posledná sekcia s dodatočnými detailmi.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <CodeBlock
            code={`// Accordion komponent
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Názov sekcie</AccordionTrigger>
    <AccordionContent>
      Obsah sekcie...
    </AccordionContent>
  </AccordionItem>
</Accordion>

// Multiple accordions naraz
<Accordion type="multiple">`}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default InteractiveComponentsSection;
