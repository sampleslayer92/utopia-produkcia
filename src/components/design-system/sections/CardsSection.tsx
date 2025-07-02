import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Star, Heart, Share2, MoreHorizontal, Calendar, MapPin, Users, TrendingUp } from "lucide-react";

const CardsSection = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Cards System</h1>
        <p className="text-slate-600 mb-6">
          Flexibilný systém kariet pre organizáciu a prezentáciu obsahu.
        </p>
      </div>

      {/* Basic Card Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Card Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Default Card */}
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Základná karta s header a content sekciou.
                </p>
              </CardContent>
            </Card>

            {/* Elevated Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Karta s výraznejším tieňom pre zvýraznenie.
                </p>
              </CardContent>
            </Card>

            {/* Gradient Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Gradient Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">
                  Karta s gradient pozadím pre premium vzhľad.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hover Card */}
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
              <CardHeader>
                <CardTitle>Hover Effect Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Karta s hover efektom pre interaktívne prvky.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Hover me</Badge>
                  <Button size="sm" variant="outline">Action</Button>
                </div>
              </CardContent>
            </Card>

            {/* Clickable Card */}
            <Card className="hover:bg-slate-50 cursor-pointer border-2 hover:border-blue-300 transition-all duration-200">
              <CardHeader>
                <CardTitle>Clickable Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Karta určená pre kliknutie s výrazným hover stavom.
                </p>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <Share2 className="h-4 w-4 text-blue-500" />
                  <MoreHorizontal className="h-4 w-4 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Complex Card Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Complex Card Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Profile Card */}
            <Card className="shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>JN</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Ján Novák</CardTitle>
                    <p className="text-sm text-slate-600">Senior Developer</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>Bratislava, Slovakia</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Joined March 2023</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Profile Completion</span>
                      <span className="text-sm text-slate-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1">Connect</Button>
                    <Button size="sm" variant="outline" className="flex-1">Message</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-900">Monthly Revenue</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    +12.5%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-green-900 mb-1">€24,567</div>
                    <div className="flex items-center space-x-2 text-sm text-green-700">
                      <TrendingUp className="h-4 w-4" />
                      <span>vs last month</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-800">Contracts</span>
                      <span className="font-semibold text-green-900">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-800">Merchants</span>
                      <span className="font-semibold text-green-900">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-800">Locations</span>
                      <span className="font-semibold text-green-900">234</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-green-200">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Card */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="relative overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white text-4xl">📱</span>
                </div>
                <Badge className="absolute top-4 right-4 bg-red-500">Hot</Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    Payment Terminal Pro
                  </CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-slate-600">4.9</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Profesionálny platobný terminál s pokročilými funkciami.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-slate-900">€299</span>
                  <span className="text-sm text-slate-500 line-through">€399</span>
                </div>
                <Button className="w-full">Add to Cart</Button>
              </CardContent>
            </Card>

            {/* Notification Card */}
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-900">System Update</CardTitle>
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    2h ago
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800 mb-4">
                  Nová verzia systému je dostupná. Obsahuje bezpečnostné vylepšenia a nové funkcie.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    <Users className="h-4 w-4" />
                    <span>Affects 234 users</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                      Later
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Update Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Card Compositions */}
      <Card>
        <CardHeader>
          <CardTitle>Card Compositions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Card Grid */}
            <div>
              <h3 className="font-semibold mb-4">Card Grid Layout</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{i + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">Card {i + 1}</div>
                          <div className="text-sm text-slate-600">Description</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Nested Cards */}
            <div>
              <h3 className="font-semibold mb-4">Nested Card Structure</h3>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Parent Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Nested Card 1</h4>
                        <p className="text-sm text-slate-600">Content inside nested card</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Nested Card 2</h4>
                        <p className="text-sm text-slate-600">Content inside nested card</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Card Best Practices</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Používaj konzistentné rozostupy (p-4, p-6)</li>
                <li>• Kombinuj s hover efektmi pre interaktívnosť</li>
                <li>• Používaj tienê pre vytvorenie hierarchie</li>
                <li>• Štruktúruj obsah s CardHeader a CardContent</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Basic Card Structure</h4>
              <pre className="text-xs font-mono text-slate-700 overflow-x-auto">
{`<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here...</p>
  </CardContent>
</Card>`}
              </pre>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">🎨 Styling Variants</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                <div>
                  <strong>Shadow variants:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• shadow-sm - subtle</li>
                    <li>• shadow-md - standard</li>
                    <li>• shadow-lg - elevated</li>
                    <li>• shadow-xl - floating</li>
                  </ul>
                </div>
                <div>
                  <strong>Background variants:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• bg-gradient-to-br</li>
                    <li>• bg-slate-50</li>
                    <li>• border-l-4 (accent)</li>
                    <li>• bg-white/80 (glass)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardsSection;