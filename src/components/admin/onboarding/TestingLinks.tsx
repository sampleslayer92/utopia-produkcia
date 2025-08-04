import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Eye, Share, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TestingLinksProps {
  configurationId: string;
  isActive: boolean;
}

interface ShareableLink {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

const TestingLinks = ({ configurationId, isActive }: TestingLinksProps) => {
  const [shareableLinks, setShareableLinks] = useState<ShareableLink[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkExpiry, setNewLinkExpiry] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (configurationId) {
      loadShareableLinks();
    }
  }, [configurationId]);

  const loadShareableLinks = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('shareable_onboarding_links')
        .select('*')
        .eq('configuration_id', configurationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setShareableLinks(data || []);
    } catch (error) {
      console.error('Error loading shareable links:', error);
    }
  };

  const createShareableLink = async () => {
    if (!newLinkName.trim()) {
      toast({ title: "Zadajte názov linku", variant: "destructive" });
      return;
    }

    setIsCreating(true);
    try {
      const linkId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const url = `${window.location.origin}/onboarding/shared/${linkId}`;
      
      const { error } = await (supabase as any)
        .from('shareable_onboarding_links')
        .insert({
          id: linkId,
          configuration_id: configurationId,
          name: newLinkName,
          url: url,
          is_active: true,
          expires_at: newLinkExpiry ? new Date(newLinkExpiry).toISOString() : null
        });

      if (error) throw error;

      await loadShareableLinks();
      setIsCreateDialogOpen(false);
      setNewLinkName('');
      setNewLinkExpiry('');
      toast({ title: "Zdieľateľný link bol vytvorený" });
    } catch (error) {
      console.error('Error creating shareable link:', error);
      toast({ title: "Chyba pri vytváraní linku", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const toggleLinkStatus = async (linkId: string, isActive: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('shareable_onboarding_links')
        .update({ is_active: isActive })
        .eq('id', linkId);

      if (error) throw error;

      await loadShareableLinks();
      toast({ title: isActive ? "Link bol aktivovaný" : "Link bol deaktivovaný" });
    } catch (error) {
      console.error('Error toggling link status:', error);
      toast({ title: "Chyba pri zmene stavu linku", variant: "destructive" });
    }
  };

  const deleteLink = async (linkId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('shareable_onboarding_links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;

      await loadShareableLinks();
      toast({ title: "Link bol odstránený" });
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({ title: "Chyba pri odstraňovaní linku", variant: "destructive" });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Link bol skopírovaný do schránky" });
    } catch (error) {
      toast({ title: "Chyba pri kopírovaní", variant: "destructive" });
    }
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  if (!isActive) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Konfigurácia nie je aktívna. Aktivujte ju pre vytvorenie testovacích linkov.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Testovanie a zdieľanie</CardTitle>
              <p className="text-sm text-muted-foreground">
                Vytvorte zdieľateľné linky na testovanie onboarding procesu
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Share className="h-4 w-4 mr-2" />
                  Vytvoriť link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Vytvoriť zdieľateľný link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Názov linku</Label>
                    <Input
                      value={newLinkName}
                      onChange={(e) => setNewLinkName(e.target.value)}
                      placeholder="Napr. Test link pre zákazníkov"
                    />
                  </div>
                  <div>
                    <Label>Dátum expirácie (voliteľné)</Label>
                    <Input
                      type="datetime-local"
                      value={newLinkExpiry}
                      onChange={(e) => setNewLinkExpiry(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Zrušiť
                    </Button>
                    <Button onClick={createShareableLink} disabled={isCreating}>
                      {isCreating ? 'Vytvára sa...' : 'Vytvoriť'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {shareableLinks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Share className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Žiadne zdieľateľné linky</p>
              <p className="text-sm">Vytvorte prvý link na testovanie onboardingu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shareableLinks.map((link) => (
                <Card key={link.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{link.name}</h4>
                          <Badge variant={link.isActive ? "default" : "secondary"}>
                            {link.isActive ? "Aktívny" : "Neaktívny"}
                          </Badge>
                          {link.expiresAt && (
                            <Badge variant="outline">
                              Vyprší: {new Date(link.expiresAt).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                          {link.url}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Vytvorené: {new Date(link.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={link.isActive}
                          onCheckedChange={(checked) => toggleLinkStatus(link.id, checked)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(link.url)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openInNewTab(link.url)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLink(link.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick test links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Rýchle testovanie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => openInNewTab(`${window.location.origin}/dynamic-onboarding?preview=true`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Náhľad v admin móde
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => openInNewTab(`${window.location.origin}/dynamic-onboarding`)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Produkčný test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestingLinks;