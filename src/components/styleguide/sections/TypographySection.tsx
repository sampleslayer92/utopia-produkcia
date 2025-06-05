
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CodeBlock from '../CodeBlock';

interface TypographySectionProps {
  searchTerm: string;
}

const TypographySection: React.FC<TypographySectionProps> = ({ searchTerm }) => {
  if (searchTerm && !('typography typografia text font písmo').includes(searchTerm.toLowerCase())) {
    return null;
  }

  return (
    <section id="typography" className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">📝 Typografia</h2>
        <p className="text-muted-foreground">
          Hierarchia textov, veľkosti písma a štýly používané v aplikácii.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hierarchia nadpisov</CardTitle>
          <CardDescription>H1 až H6 štýly s príkladmi použitia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold">Heading 1 - Hlavný nadpis</h1>
              <code className="text-sm text-muted-foreground">text-4xl font-bold</code>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Heading 2 - Sekčný nadpis</h2>
              <code className="text-sm text-muted-foreground">text-3xl font-bold</code>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Heading 3 - Podnadpis</h3>
              <code className="text-sm text-muted-foreground">text-2xl font-semibold</code>
            </div>
            <div>
              <h4 className="text-xl font-semibold">Heading 4 - Menší nadpis</h4>
              <code className="text-sm text-muted-foreground">text-xl font-semibold</code>
            </div>
            <div>
              <h5 className="text-lg font-medium">Heading 5 - Malý nadpis</h5>
              <code className="text-sm text-muted-foreground">text-lg font-medium</code>
            </div>
            <div>
              <h6 className="text-base font-medium">Heading 6 - Najmenší nadpis</h6>
              <code className="text-sm text-muted-foreground">text-base font-medium</code>
            </div>
          </div>

          <CodeBlock
            code={`// Použitie nadpisov
<h1 className="text-4xl font-bold">Hlavný nadpis stránky</h1>
<h2 className="text-3xl font-bold">Nadpis sekcie</h2>
<h3 className="text-2xl font-semibold">Podnadpis</h3>

// Card komponenty
<CardTitle className="text-2xl font-semibold">
  Nadpis karty
</CardTitle>`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Body Text & Utility Classes</CardTitle>
          <CardDescription>Základné textové štýly a utility triedy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="text-base">Základný text (text-base) - štandardná veľkosť pre obsah.</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Menší text (text-sm text-muted-foreground) - popisky a menej dôležité informácie.
              </p>
            </div>
            <div>
              <p className="text-lg font-medium">
                Väčší text (text-lg font-medium) - dôležitejšie informácie.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Extra malý text (text-xs) - poznámky a technické informácie.
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="font-bold">Tučný text</p>
            <p className="font-semibold">Polo-tučný text</p>
            <p className="font-medium">Stredne tučný text</p>
            <p className="font-normal">Normálny text</p>
            <p className="font-light">Tenký text</p>
          </div>

          <CodeBlock
            code={`// Textové štýly
<p className="text-base">Základný obsah</p>
<p className="text-sm text-muted-foreground">Popisky</p>
<p className="text-lg font-medium">Zvýraznený text</p>

// Font weights
<span className="font-bold">Tučný</span>
<span className="font-semibold">Polo-tučný</span>
<span className="font-medium">Stredný</span>

// Utility triedy
<p className="text-center">Centrovaný text</p>
<p className="text-right">Text vpravo</p>
<p className="uppercase">VEĽKÉ PÍSMENÁ</p>
<p className="capitalize">Prvé Písmená Veľké</p>`}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default TypographySection;
