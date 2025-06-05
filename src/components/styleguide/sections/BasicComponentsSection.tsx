
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import CodeBlock from '../CodeBlock';

interface BasicComponentsSectionProps {
  searchTerm: string;
}

const BasicComponentsSection: React.FC<BasicComponentsSectionProps> = ({ searchTerm }) => {
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  if (searchTerm && !('basic základné button input checkbox select badge alert').includes(searchTerm.toLowerCase())) {
    return null;
  }

  return (
    <section id="basic" className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">🧩 Základné komponenty</h2>
        <p className="text-muted-foreground">
          Základné UI komponenty používané naprieč celou aplikáciou.
        </p>
      </div>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Všetky varianty buttonov s ich použitím</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Button>Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">📧</Button>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <Button disabled>Disabled</Button>
            <Button disabled>Loading...</Button>
          </div>

          <CodeBlock
            code={`// Button varianty
<Button>Primary button</Button>
<Button variant="destructive">Zmazať</Button>
<Button variant="outline">Outline button</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost button</Button>
<Button variant="link">Link button</Button>

// Veľkosti
<Button size="sm">Malý</Button>
<Button size="lg">Veľký</Button>
<Button size="icon"><Icon /></Button>

// Stavy
<Button disabled>Nedostupný</Button>`}
          />
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Input Fields</CardTitle>
          <CardDescription>Vstupné polia a formulárové elementy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="basic-input">Základný input</Label>
            <Input 
              id="basic-input"
              placeholder="Zadajte text..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password-input">Password input</Label>
            <Input id="password-input" type="password" placeholder="Heslo..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="disabled-input">Nedostupný input</Label>
            <Input id="disabled-input" disabled placeholder="Nedostupný..." />
          </div>

          <CodeBlock
            code={`// Základné použitie
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email"
    type="email"
    placeholder="vas@email.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>

// Input s chybou
<Input 
  className="border-destructive focus:ring-destructive"
  placeholder="Chybný vstup"
/>`}
          />
        </CardContent>
      </Card>

      {/* Form Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Form Controls</CardTitle>
          <CardDescription>Checkboxy, selecty a iné formulárové elementy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="checkbox1" 
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(checked === true)}
              />
              <Label htmlFor="checkbox1">Súhlasím s podmienkami</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="checkbox2" disabled />
              <Label htmlFor="checkbox2">Nedostupná možnosť</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select dropdown</Label>
            <Select>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Vyberte možnosť" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Možnosť 1</SelectItem>
                <SelectItem value="option2">Možnosť 2</SelectItem>
                <SelectItem value="option3">Možnosť 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CodeBlock
            code={`// Checkbox
<div className="flex items-center space-x-2">
  <Checkbox 
    id="terms" 
    checked={agreedToTerms}
    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
  />
  <Label htmlFor="terms">Súhlasím s podmienkami</Label>
</div>

// Select dropdown
<Select value={selectedValue} onValueChange={setSelectedValue}>
  <SelectTrigger>
    <SelectValue placeholder="Vyberte možnosť" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="sk">Slovenčina</SelectItem>
    <SelectItem value="en">English</SelectItem>
  </SelectContent>
</Select>`}
          />
        </CardContent>
      </Card>

      {/* Badges & Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Badges & Alerts</CardTitle>
          <CardDescription>Označenia stavov a upozornenia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>

          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upozornenie</AlertTitle>
              <AlertDescription>
                Toto je základné upozornenie pre používateľa.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Chyba</AlertTitle>
              <AlertDescription>
                Vyskytla sa chyba pri spracovaní vašej požiadavky.
              </AlertDescription>
            </Alert>
          </div>

          <CodeBlock
            code={`// Badges pre stavy
<Badge variant="secondary">Draft</Badge>
<Badge className="bg-green-100 text-green-700">Approved</Badge>
<Badge variant="destructive">Rejected</Badge>

// Alert komponenty
<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Dôležité upozornenie</AlertTitle>
  <AlertDescription>
    Popis upozornenia pre používateľa.
  </AlertDescription>
</Alert>`}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default BasicComponentsSection;
