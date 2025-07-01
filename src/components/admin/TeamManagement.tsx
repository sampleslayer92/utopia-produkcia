import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Users, UserCheck, UserX, Edit, Key, Copy, Info, LogIn, RotateCcw } from "lucide-react";
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from './AdminLayout';

const TeamManagement = () => {
  const { teamMembers, isLoading, isSaving, createTeamMember, updateTeamMember, resetMemberPassword, deactivateTeamMember, activateTeamMember } = useTeamManagement();
  const { signOut } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [resetPasswordMember, setResetPasswordMember] = useState<any>(null);
  const [newMemberCredentials, setNewMemberCredentials] = useState<{email: string, password: string} | null>(null);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);

  const handleCreateMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const password = formData.get('password') as string;
    const email = formData.get('email') as string;
    
    const memberData = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email,
      phone: formData.get('phone') as string,
      password,
      role: formData.get('role') as 'admin' | 'partner' | 'merchant',
    };

    const { error } = await createTeamMember(memberData);
    if (!error) {
      setIsCreateDialogOpen(false);
      setNewMemberCredentials({ email, password });
      setShowCredentialsDialog(true);
      (e.target as HTMLFormElement).reset();
    }
  };

  const handleTestLoginAs = async (member: any) => {
    if (confirm(`Chcete sa dočasne prihlásiť ako ${member.first_name} ${member.last_name}? Budete odhlásený zo súčasnej session.`)) {
      try {
        // Sign out current user
        await signOut();
        
        // Redirect to auth page with a special parameter
        window.location.href = `/auth?test_user=${member.email}`;
        
        toast.info('Odhlásený. Teraz sa môžete prihlásiť ako testovací používateľ.');
      } catch (error) {
        toast.error('Chyba pri odhlásení');
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetPasswordMember) return;

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;

    const { error } = await resetMemberPassword(resetPasswordMember.id, newPassword);
    if (!error) {
      setResetPasswordMember(null);
      toast.success('Heslo bolo úspešne zmenené', {
        description: `Nové heslo: ${newPassword}`
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} skopírované do schránky`);
  };

  const handleUpdateMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMember) return;

    const formData = new FormData(e.currentTarget);
    
    const updates = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as 'admin' | 'partner' | 'merchant',
    };

    const { error } = await updateTeamMember(editingMember.id, updates);
    if (!error) {
      setEditingMember(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'partner':
        return <Badge variant="default">Partner</Badge>;
      case 'merchant':
        return <Badge variant="secondary">Merchant</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Správa tímu" subtitle="Spravujte členov vášho tímu a ich oprávnenia">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Načítava sa...</span>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Správa tímu" subtitle="Spravujte členov vášho tímu a ich oprávnenia">
      <div className="space-y-6">
        {/* Role Management Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Info className="h-5 w-5" />
              Správa rolí a používateľov
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-blue-900 mb-2">Admin</div>
                <div className="text-blue-700">Plný prístup k systému, správa tímu, všetky zmluvy</div>
              </div>
              <div>
                <div className="font-medium text-blue-900 mb-2">Partner</div>
                <div className="text-blue-700">Vytváranie zmlúv, správa vlastných obchodníkov</div>
              </div>
              <div>
                <div className="font-medium text-blue-900 mb-2">Merchant</div>
                <div className="text-blue-700">Zobrazenie vlastných zmlúv a údajov</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Správa tímu
                </CardTitle>
                <CardDescription>
                  Spravujte členov vášho tímu a ich oprávnenia
                </CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Pridať člena
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Pridať nového člena tímu</DialogTitle>
                    <DialogDescription>
                      Vytvorte nový účet pre člena vášho tímu. Prihlasovacie údaje budú zobrazené po vytvorení.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateMember} className="space-y-4">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">Meno</Label>
                        <Input id="first_name" name="first_name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Priezvisko</Label>
                        <Input id="last_name" name="last_name" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefón</Label>
                      <Input id="phone" name="phone" type="tel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Dočasné heslo</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        placeholder="Zadajte dočasné heslo"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rola</Label>
                      <Select name="role" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte rolu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="merchant">Merchant</SelectItem>
                          <SelectItem value="partner">Partner</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Zrušiť
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Vytvára sa...' : 'Vytvoriť'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Člen</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rola</TableHead>
                  <TableHead>Stav</TableHead>
                  <TableHead>Vytvorený</TableHead>
                  <TableHead>Akcie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {member.first_name[0]}{member.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.first_name} {member.last_name}</p>
                          {member.phone && (
                            <p className="text-sm text-slate-600">{member.phone}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{getRoleBadge(member.role)}</TableCell>
                    <TableCell>
                      {member.is_active ? (
                        <Badge variant="outline" className="text-green-600">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Aktívny
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600">
                          <UserX className="h-3 w-3 mr-1" />
                          Neaktívny
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString('sk-SK')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingMember(member)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setResetPasswordMember(member)}
                          title="Zmeniť heslo"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTestLoginAs(member)}
                          title="Test prihlásenie ako tento používateľ"
                        >
                          <LogIn className="h-3 w-3" />
                        </Button>
                        {member.is_active ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deactivateTeamMember(member.id)}
                          >
                            <UserX className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => activateTeamMember(member.id)}
                          >
                            <UserCheck className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        
        {/* Credentials Display Dialog */}
        <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Prihlasovacie údaje
              </DialogTitle>
              <DialogDescription>
                Nový člen tímu bol úspešne vytvorený. Tieto údaje použite pre prihlásenie:
              </DialogDescription>
            </DialogHeader>
            {newMemberCredentials && (
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Skopírujte a bezpečne uložte tieto prihlasovacie údaje. Nezabudnite ich odovzdať novému členovi tímu.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Email:</Label>
                      <p className="text-sm">{newMemberCredentials.email}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(newMemberCredentials.email, 'Email')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Heslo:</Label>
                      <p className="text-sm font-mono">{newMemberCredentials.password}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(newMemberCredentials.password, 'Heslo')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCredentialsDialog(false);
                      setNewMemberCredentials(null);
                    }}
                  >
                    Zavrieť
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Member Dialog */}
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upraviť člena tímu</DialogTitle>
              <DialogDescription>
                Upravte údaje člena tímu
              </DialogDescription>
            </DialogHeader>
            {editingMember && (
              <form onSubmit={handleUpdateMember} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_first_name">Meno</Label>
                    <Input 
                      id="edit_first_name" 
                      name="first_name" 
                      defaultValue={editingMember.first_name}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_last_name">Priezvisko</Label>
                    <Input 
                      id="edit_last_name" 
                      name="last_name" 
                      defaultValue={editingMember.last_name}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_email">Email</Label>
                  <Input 
                    id="edit_email" 
                    name="email" 
                    type="email" 
                    defaultValue={editingMember.email}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_phone">Telefón</Label>
                  <Input 
                    id="edit_phone" 
                    name="phone" 
                    type="tel" 
                    defaultValue={editingMember.phone || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_role">Rola</Label>
                  <Select name="role" defaultValue={editingMember.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="merchant">Merchant</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setEditingMember(null)}>
                    Zrušiť
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Ukladá sa...' : 'Uložiť'}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={!!resetPasswordMember} onOpenChange={() => setResetPasswordMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Zmeniť heslo</DialogTitle>
              <DialogDescription>
                Zmeňte heslo pre {resetPasswordMember?.first_name} {resetPasswordMember?.last_name}
              </DialogDescription>
            </DialogHeader>
            {resetPasswordMember && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nové heslo</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword" 
                    type="password" 
                    placeholder="Zadajte nové heslo"
                    required 
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setResetPasswordMember(null)}>
                    Zrušiť
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Mení sa...' : 'Zmeniť heslo'}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default TeamManagement;
