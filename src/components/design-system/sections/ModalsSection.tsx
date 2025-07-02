import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, AlertTriangle, Info, CheckCircle2, Settings, User, FileText } from "lucide-react";

const ModalsSection = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Modals & Dialogs</h1>
        <p className="text-slate-600 mb-6">
          Systém modalov, dialógov a sheet komponentov pre overlay obsah.
        </p>
      </div>

      {/* Dialog Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Dialog Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Dialog */}
            <div className="space-y-3">
              <h3 className="font-semibold">Basic Dialog</h3>
              <p className="text-sm text-slate-600">
                Štandardný dialog pre formuláre a obsah.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Open Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input id="project-name" placeholder="My awesome project" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Project description..." />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Project</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Large Dialog */}
            <div className="space-y-3">
              <h3 className="font-semibold">Large Dialog</h3>
              <p className="text-sm text-slate-600">
                Veľký dialog pre komplexný obsah.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Large Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Advanced Settings
                    </DialogTitle>
                    <DialogDescription>
                      Configure advanced settings for your application.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">General Settings</h4>
                      <div className="space-y-3">
                        <div>
                          <Label>Application Name</Label>
                          <Input placeholder="App name" />
                        </div>
                        <div>
                          <Label>Environment</Label>
                          <Input placeholder="Production" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Security Settings</h4>
                      <div className="space-y-3">
                        <div>
                          <Label>API Key</Label>
                          <Input type="password" placeholder="••••••••" />
                        </div>
                        <div>
                          <Label>Webhook URL</Label>
                          <Input placeholder="https://..." />
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Custom Styled Dialog */}
            <div className="space-y-3">
              <h3 className="font-semibold">Custom Styled</h3>
              <p className="text-sm text-slate-600">
                Dialog s custom štýlovaním.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Custom Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                  <DialogHeader>
                    <DialogTitle className="text-blue-900 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Success!
                    </DialogTitle>
                    <DialogDescription className="text-blue-700">
                      Your action has been completed successfully.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-slate-700">
                      Everything looks good! You can continue with your workflow.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Continue
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Dialogs */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Dialogs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Destructive Alert */}
            <div className="space-y-3">
              <h3 className="font-semibold text-red-700">Destructive Action</h3>
              <p className="text-sm text-slate-600">
                Pre nebezpečné akcie ako mazanie.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                      Yes, delete account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Confirmation Alert */}
            <div className="space-y-3">
              <h3 className="font-semibold text-blue-700">Confirmation</h3>
              <p className="text-sm text-slate-600">
                Pre potvrdenie dôležitých akcií.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Save Changes
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-500" />
                      Save Changes?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You have unsaved changes. Do you want to save them before continuing?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Don't Save</AlertDialogCancel>
                    <AlertDialogAction>Save Changes</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Success Alert */}
            <div className="space-y-3">
              <h3 className="font-semibold text-green-700">Success</h3>
              <p className="text-sm text-slate-600">
                Pre úspešné akcie a potvrdenia.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Complete Setup
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="h-5 w-5" />
                      Setup Complete!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Your application has been successfully configured. You can now start using all features.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction className="bg-green-600 hover:bg-green-700">
                      Get Started
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sheet Components */}
      <Card>
        <CardHeader>
          <CardTitle>Sheet Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Right Sheet */}
            <div className="space-y-3">
              <h3 className="font-semibold">Right Sheet</h3>
              <p className="text-sm text-slate-600">
                Štandardný sheet z pravej strany.
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Open Right
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                    <SheetDescription>
                      Manage your account settings here.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-4">
                    <div>
                      <Label>Display Name</Label>
                      <Input placeholder="John Doe" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <Textarea placeholder="Tell us about yourself..." />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Left Sheet */}
            <div className="space-y-3">
              <h3 className="font-semibold">Left Sheet</h3>
              <p className="text-sm text-slate-600">
                Sheet z ľavej strany pre navigáciu.
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Open Left
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                    <SheetDescription>
                      Quick access to main sections.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6">
                    <nav className="space-y-2">
                      {[
                        { icon: User, label: 'Profile', active: true },
                        { icon: Settings, label: 'Settings', active: false },
                        { icon: FileText, label: 'Documents', active: false },
                      ].map((item) => (
                        <Button
                          key={item.label}
                          variant={item.active ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Top Sheet */}
            <div className="space-y-3">
              <h3 className="font-semibold">Top Sheet</h3>
              <p className="text-sm text-slate-600">
                Sheet zhora pre notifikácie.
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Open Top
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="h-80">
                  <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                    <SheetDescription>
                      Recent notifications and updates.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Notification {i + 1}</p>
                          <p className="text-sm text-slate-600">Description of the notification.</p>
                          <p className="text-xs text-slate-500">2 minutes ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Bottom Sheet */}
            <div className="space-y-3">
              <h3 className="font-semibold">Bottom Sheet</h3>
              <p className="text-sm text-slate-600">
                Sheet zdola pre mobile-like UX.
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Open Bottom
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-80">
                  <SheetHeader>
                    <SheetTitle>Quick Actions</SheetTitle>
                    <SheetDescription>
                      Frequently used actions and shortcuts.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Create', color: 'bg-blue-100 text-blue-700' },
                        { label: 'Edit', color: 'bg-green-100 text-green-700' },
                        { label: 'Delete', color: 'bg-red-100 text-red-700' },
                        { label: 'Share', color: 'bg-purple-100 text-purple-700' },
                        { label: 'Export', color: 'bg-orange-100 text-orange-700' },
                        { label: 'Settings', color: 'bg-slate-100 text-slate-700' },
                      ].map((action) => (
                        <Button
                          key={action.label}
                          variant="outline"
                          className={`h-16 flex-col ${action.color} border-transparent`}
                        >
                          <div className="text-lg mb-1">•</div>
                          <span className="text-xs">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
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
              <h4 className="font-semibold text-blue-800 mb-2">🎯 When to use what</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                <div>
                  <strong>Dialog:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Formuláre</li>
                    <li>• Detaily</li>
                    <li>• Editácia</li>
                    <li>• Konfigurácia</li>
                  </ul>
                </div>
                <div>
                  <strong>AlertDialog:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Potvrdenia</li>
                    <li>• Varovania</li>
                    <li>• Kritické akcie</li>
                    <li>• Chybové hlásenia</li>
                  </ul>
                </div>
                <div>
                  <strong>Sheet:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Navigácia</li>
                    <li>• Filtre</li>
                    <li>• Mobile UX</li>
                    <li>• Quick actions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Basic Implementation</h4>
              <pre className="text-xs font-mono text-slate-700 overflow-x-auto">
{`// Dialog
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>

// AlertDialog
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
              </pre>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">💡 Best Practices</h4>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• Používaj správny typ modalu pre daný use case</li>
                <li>• Vždy poskytni spôsob zatvorenia (X, Cancel, ESC)</li>
                <li>• Obmedz veľkosť obsahu pre lepšiu UX</li>
                <li>• Používaj loading states pre async operácie</li>
                <li>• Testuj dostupnosť (focus management, ARIA)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModalsSection;